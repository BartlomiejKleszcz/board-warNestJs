import { Injectable } from '@nestjs/common'; // nest DI
import { countMovement } from '../../board/domain/hex.utils'; // distance helper
import { UnitFactory } from '../../units/domain/unit-factory'; // unit stats
import type {
  GameState,
  HexTileState,
  UnitOnBoardState,
} from '../model/game-state'; // state types

export type AiAction = {
  type: 'MOVE' | 'ATTACK' | 'END_TURN';
  playerId: number;
  payload?: Record<string, any>;
  rolls?: number[];
};

type CoordKey = string;

@Injectable()
export class AiService {
  private readonly unitFactory = new UnitFactory();

  buildTurnActions(state: GameState, aiPlayerId: number): AiAction[] {
    const actions: AiAction[] = [];
    const aiUnits = state.units.filter(
      (u) => u.ownerPlayerId === aiPlayerId && u.currentHP > 0,
    );
    const enemyUnits = state.units.filter(
      (u) => u.ownerPlayerId !== aiPlayerId && u.currentHP > 0,
    );

    if (!enemyUnits.length || !aiUnits.length) {
      actions.push(this.buildEndTurn(aiPlayerId));
      return actions;
    }

    let workingState = state;
    for (const unit of aiUnits) {
      const action =
        this.pickAttackAction(workingState, unit, enemyUnits, aiPlayerId) ??
        this.pickMoveAction(workingState, unit, enemyUnits, aiPlayerId);
      if (action) {
        actions.push(action);
        workingState = this.applyLocalAction(workingState, action);
      }
    }

    actions.push(this.buildEndTurn(aiPlayerId));
    return actions;
  }

  private pickAttackAction(
    state: GameState,
    unit: UnitOnBoardState,
    enemyUnits: UnitOnBoardState[],
    aiPlayerId: number,
  ): AiAction | null {
    const unitTemplate = this.unitFactory.createFromName(unit.template);
    const inRange = enemyUnits
      .map((enemy) => ({
        enemy,
        dist: countMovement({ q: unit.q, r: unit.r }, { q: enemy.q, r: enemy.r }),
      }))
      .filter(({ dist }) => dist <= unitTemplate.attackRange || dist <= 1);

    if (!inRange.length) {
      return null;
    }

    const target = inRange
      .sort((a, b) => {
        if (a.enemy.currentHP !== b.enemy.currentHP) {
          return a.enemy.currentHP - b.enemy.currentHP;
        }
        return a.dist - b.dist;
      })
      .map((entry) => entry.enemy)[0];

    const distance = countMovement(
      { q: unit.q, r: unit.r },
      { q: target.q, r: target.r },
    );

    const mode =
      distance <= 1 || unitTemplate.rangedAttack <= 0
        ? 'melee'
        : 'ranged';

    const damageData = this.calculateDamage(
      unitTemplate.meleeAttack,
      unitTemplate.rangedAttack,
      mode,
      target.template,
    );

    return {
      type: 'ATTACK',
      playerId: aiPlayerId,
      payload: {
        attackerUnitId: unit.unitId,
        targetUnitId: target.unitId,
        damage: damageData.damage,
        mode,
      },
      rolls: [damageData.roll],
    };
  }

  private pickMoveAction(
    state: GameState,
    unit: UnitOnBoardState,
    enemyUnits: UnitOnBoardState[],
    aiPlayerId: number,
  ): AiAction | null {
    const unitTemplate = this.unitFactory.createFromName(unit.template);
    const target = this.pickClosestEnemy(unit, enemyUnits);
    if (!target) return null;

    const currentDistance = countMovement(
      { q: unit.q, r: unit.r },
      { q: target.q, r: target.r },
    );

    const blocked = new Set<CoordKey>();
    state.units.forEach((u) => {
      if (u.unitId !== unit.unitId && u.currentHP > 0) {
        blocked.add(this.coordKey(u.q, u.r));
      }
    });

    const reachable: Array<{ q: number; r: number; cost: number }> =
      this.getReachableTiles(
      state.tiles,
      { q: unit.q, r: unit.r },
      unitTemplate.speed,
      blocked,
    );

    type MoveCandidate = { q: number; r: number; cost: number; dist: number };
    let best: MoveCandidate | undefined;
    for (const value of reachable) {
      const dist = countMovement(
        { q: value.q, r: value.r },
        { q: target.q, r: target.r },
      );
      const candidate: MoveCandidate = { ...value, dist };
      if (
        !best ||
        candidate.dist < best.dist ||
        (candidate.dist === best.dist && candidate.cost < best.cost)
      ) {
        best = candidate;
      }
    }

    if (!best || best.dist >= currentDistance) {
      return null;
    }

    return {
      type: 'MOVE',
      playerId: aiPlayerId,
      payload: { unitId: unit.unitId, q: best.q, r: best.r },
    };
  }

  private pickClosestEnemy(
    unit: UnitOnBoardState,
    enemyUnits: UnitOnBoardState[],
  ): UnitOnBoardState | null {
    if (!enemyUnits.length) return null;
    return enemyUnits
      .map((enemy) => ({
        enemy,
        dist: countMovement({ q: unit.q, r: unit.r }, { q: enemy.q, r: enemy.r }),
      }))
      .sort((a, b) => {
        if (a.dist !== b.dist) {
          return a.dist - b.dist;
        }
        return a.enemy.currentHP - b.enemy.currentHP;
      })
      .map((entry) => entry.enemy)[0];
  }

  private calculateDamage(
    meleeAttack: number,
    rangedAttack: number,
    mode: 'melee' | 'ranged',
    defenderTemplateId: UnitOnBoardState['template'],
  ) {
    const defenderTemplate = this.unitFactory.createFromName(defenderTemplateId);
    const attackValue = mode === 'ranged' ? rangedAttack : meleeAttack;
    const rawDamage = attackValue - defenderTemplate.defense;
    const roll = Math.floor(Math.random() * 6) + 1;
    const damage = roll === 6 ? 0 : Math.max(1, rawDamage);
    return { damage, roll };
  }

  private getReachableTiles(
    tiles: HexTileState[],
    start: { q: number; r: number },
    maxCost: number,
    blocked: Set<CoordKey>,
  ): Array<{ q: number; r: number; cost: number }> {
    const tileMap = new Map<CoordKey, HexTileState>();
    tiles.forEach((tile) => {
      tileMap.set(this.coordKey(tile.q, tile.r), tile);
    });

    const open: { q: number; r: number; cost: number }[] = [
      { q: start.q, r: start.r, cost: 0 },
    ];
    const costs = new Map<CoordKey, number>();
    costs.set(this.coordKey(start.q, start.r), 0);

    while (open.length) {
      let bestIdx = 0;
      for (let i = 1; i < open.length; i += 1) {
        if (open[i].cost < open[bestIdx].cost) {
          bestIdx = i;
        }
      }
      const current = open.splice(bestIdx, 1)[0];
      if (current.cost > maxCost) continue;

      const neighbors = this.getNeighbors(current.q, current.r, tileMap);
      for (const neighbor of neighbors) {
        const key = this.coordKey(neighbor.q, neighbor.r);
        if (blocked.has(key)) continue;
        if (!neighbor.passable) continue;
        const nextCost = current.cost + neighbor.movementCost;
        if (nextCost > maxCost) continue;
        const existing = costs.get(key);
        if (existing === undefined || nextCost < existing) {
          costs.set(key, nextCost);
          open.push({ q: neighbor.q, r: neighbor.r, cost: nextCost });
        }
      }
    }

    const reachable: Array<{ q: number; r: number; cost: number }> = [];
    costs.forEach((cost, key) => {
      const [q, r] = key.split(':').map(Number);
      reachable.push({ q, r, cost });
    });
    return reachable;
  }

  private getNeighbors(
    q: number,
    r: number,
    tileMap: Map<CoordKey, HexTileState>,
  ): HexTileState[] {
    const dirs = [
      { q: 1, r: 0 },
      { q: -1, r: 0 },
      { q: 0, r: 1 },
      { q: 0, r: -1 },
    ];
    return dirs
      .map((dir) => tileMap.get(this.coordKey(q + dir.q, r + dir.r)))
      .filter((tile): tile is HexTileState => !!tile);
  }

  private coordKey(q: number, r: number): CoordKey {
    return `${q}:${r}`;
  }

  private buildEndTurn(playerId: number): AiAction {
    return { type: 'END_TURN', playerId };
  }

  private applyLocalAction(state: GameState, action: AiAction): GameState {
    const nextState: GameState = {
      ...state,
      units: state.units.map((u) => ({ ...u })),
    };

    switch (action.type) {
      case 'MOVE': {
        const { unitId, q, r } = action.payload ?? {};
        if (unitId !== undefined && q !== undefined && r !== undefined) {
          nextState.units = nextState.units.map((u) =>
            u.unitId === String(unitId) ? { ...u, q, r } : u,
          );
        }
        break;
      }
      case 'ATTACK': {
        const { targetUnitId, damage } = action.payload ?? {};
        if (targetUnitId !== undefined && typeof damage === 'number') {
          nextState.units = nextState.units.map((u) =>
            u.unitId === String(targetUnitId)
              ? { ...u, currentHP: Math.max(0, u.currentHP - damage) }
              : u,
          );
        }
        break;
      }
      default:
        break;
    }

    return nextState;
  }
}
