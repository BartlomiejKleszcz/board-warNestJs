import { HexTile } from "./hex.types";

export interface Board {

    tiles: HexTile[];
    getNeighbors(tile: HexTile, board: Board): HexTile[];
}

export default class GameBoard implements Board {

    constructor(public tiles: HexTile[]) {}

    getHexTile(): HexTile[] {
        return this.tiles;
    }

    getNeighbors(tile: HexTile, board: Board): HexTile[]{
        let hexTiles: HexTile[] = [];
        // north
        let hexTileNorth: HexTile | undefined = board.tiles.find(tile => tile.coords.q === tile.coords.q + 1)
        if(hexTileNorth !== undefined) hexTiles.push(hexTileNorth);
        // south
        let hexTileSouth: HexTile | undefined = board.tiles.find(tile => tile.coords.q === tile.coords.q - 1)
        if(hexTileSouth !== undefined) hexTiles.push(hexTileSouth);
        // west
        let hexTileWest = board.tiles.find(tile => tile.coords.r === tile.coords.r - 1)
        if(hexTileWest !== undefined) hexTiles.push(hexTileWest);
        // east
        let hexTileEast = board.tiles.find(tile => tile.coords.r === tile.coords.r + 1)
        if(hexTileEast !== undefined) hexTiles.push(hexTileEast)
        return hexTiles
    }
}