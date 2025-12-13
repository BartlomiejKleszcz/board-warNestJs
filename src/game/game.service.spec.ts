import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from 'src/board/board.service';
import { PlayerService } from 'src/player/player.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnitsService } from 'src/units/units.service';
import { GameService } from './game.service';
import { type GameState } from './model/game-state';

describe('GameService', () => {
  let service: GameService;
  const mockDeps = {
    player: {},
    board: {},
    units: {},
    prisma: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: PlayerService, useValue: mockDeps.player },
        { provide: BoardService, useValue: mockDeps.board },
        { provide: UnitsService, useValue: mockDeps.units },
        { provide: PrismaService, useValue: mockDeps.prisma },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reduceAction (ATTACK)', () => {
    const baseState: GameState = {
      gameId: '1',
      turnNumber: 1,
      currentPlayerId: 10,
      status: 'in_progress',
      players: [
        { playerId: 10, name: 'P1', color: 'red' },
        { playerId: 20, name: 'P2', color: 'blue' },
      ],
      units: [
        {
          unitId: 'u1',
          ownerPlayerId: 10,
          template: 'light-infantry',
          currentHP: 5,
          q: 0,
          r: 0,
        },
        {
          unitId: 'u2',
          ownerPlayerId: 20,
          template: 'guard-infantry',
          currentHP: 7,
          q: 1,
          r: 1,
        },
      ],
      tiles: [],
    };

    it('subtracts damage from target HP', () => {
      const action = {
        type: 'ATTACK',
        payload: { targetUnitId: 'u1', damage: 3 },
      } as const;

      const result = (service as unknown as { reduceAction: Function }).reduceAction(
        baseState,
        action,
      ) as GameState;

      const target = result.units.find((u) => u.unitId === 'u1');
      expect(target?.currentHP).toBe(2);
      const other = result.units.find((u) => u.unitId === 'u2');
      expect(other?.currentHP).toBe(7);
    });

    it('caps HP at zero when overkilled', () => {
      const action = {
        type: 'ATTACK',
        payload: { targetUnitId: 'u2', damage: 999 },
      } as const;

      const result = (service as unknown as { reduceAction: Function }).reduceAction(
        baseState,
        action,
      ) as GameState;

      const target = result.units.find((u) => u.unitId === 'u2');
      expect(target?.currentHP).toBe(0);
    });
  });
});
