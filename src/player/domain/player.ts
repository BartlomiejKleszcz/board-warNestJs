import { Unit } from "src/units/domain/unit.types";

export class Player {
    id: number;
    name: string;
    color: string;
    units: Unit[];

    constructor(id: number, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.units = [];
    }
}