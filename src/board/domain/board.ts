import { HexTile } from "./hex.types";

export interface Board {
    tiles: HexTile[];
}

export default class GameBoard implements Board {
    constructor(public tiles: HexTile[]) {}
    getHexTile(): HexTile[] {
        throw new Error("Method not implemented.");
    }

}