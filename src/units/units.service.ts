import { Injectable } from '@nestjs/common';
import { Player } from 'src/player/domain/player';
import { Unit, UnitName } from './domain/unit.types';
import { UnitFactory } from './domain/unit-factory';

@Injectable()
export class UnitsService {

    private customUnits: Unit[] = [];
    private readonly factory = new UnitFactory();
    private readonly unitHp = new Map<number, number>(); // uniqueId -> current hp

    createUnit(id: UnitName, player: Player): Unit {
        const newUnit = this.factory.createFromName(id);
        player.budget -= newUnit.cost;
        if (player.budget < 0) {
            throw new Error('Insufficient budget to create this unit.');
        }
        return this.registerUnit(newUnit);
    }
    createUnitWithoutPlayer(id: UnitName): Unit {
        const newUnit = this.factory.createFromName(id);
        return this.registerUnit(newUnit);
    }

    private registerUnit(unit: Unit): Unit {
        this.customUnits.push(unit);
        this.unitHp.set(unit.uniqueId, unit.maxHp);
        return unit;
    }

    getPlayerUnits(playerId: Player['id']): Unit[] {
        let units: Unit[] = [];
        return units
    }

    getAllAvailableUnits(): Unit[] {
        return this.factory.getAllUnitTemplates();
    }

    getUnitById(id: UnitName): Unit {
        return this.factory.createFromName(id);
    }

    getUnitInstance(uniqueId: number): Unit | undefined {
        return this.customUnits.find(u => u.uniqueId === uniqueId);
    }

    getCurrentHp(uniqueId: number): number | undefined {
        return this.unitHp.get(uniqueId);
    }

    attack(attackerId: number, defenderId: number, mode: 'melee' | 'ranged' = 'melee') {
        const attacker = this.getUnitInstance(attackerId);
        const defender = this.getUnitInstance(defenderId);
        if (!attacker || !defender) {
            throw new Error('Attacker or defender not found');
        }

        const defenderHp = this.unitHp.get(defender.uniqueId);
        if (defenderHp === undefined) {
            throw new Error('Defender HP state missing');
        }

        const attackValue = mode === 'ranged' ? attacker.rangedAttack : attacker.meleeAttack;
        const rawDamage = attackValue - defender.defense;
        const damage = Math.max(1, rawDamage);

        const newHp = Math.max(0, defenderHp - damage);
        this.unitHp.set(defender.uniqueId, newHp);

        return {
            attackerId: attacker.uniqueId,
            defenderId: defender.uniqueId,
            mode,
            damage,
            defenderHpBefore: defenderHp,
            defenderHpAfter: newHp,
            destroyed: newHp === 0,
        };
    }
}
