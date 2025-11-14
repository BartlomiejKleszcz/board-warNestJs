import { Unit, UnitName } from "./unit.types";

export class GameUnit implements Unit {
    constructor(
        public name: string,
        public id: UnitName,
        public maxHp: number,
        public meleeAttack: number,
        public rangedAttack: number,
        public attackRange: number,
        public defense: number,
        public speed: number,
        public cost: number,
    ){}
}

