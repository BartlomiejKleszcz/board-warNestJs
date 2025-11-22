import { Board } from "./board";
import { HexCoords, HexTile } from "./hex.types";


export function countMovement(positionHexCoords: HexCoords, targetHexCoords: HexCoords, board: Board) {
  const distanceQ = positionHexCoords.q - targetHexCoords.q;
  const distanceR = positionHexCoords.r - targetHexCoords.r;
  const distanceS = -(positionHexCoords.q + positionHexCoords.r) + (targetHexCoords.q + targetHexCoords.r);
  return (Math.abs(distanceQ) + Math.abs(distanceR) + Math.abs(distanceS)) / 2;
}

type Road{
  movementCost;
  road: HexTile[]
}

export function countRoad(positionHexTile: HexTile, targetHexTile: HexTile, board: Board){

  let movementCost = 0;
  let road: HexTile[]= [];

  while(positionHexTile.coords.q !== targetHexTile.coords.q &&
        positionHexTile.coords.r !== targetHexTile.coords.r
   ) {
    let direction: number[] = determineDirection(positionHexTile, targetHexTile, board)

    
    movementCost =+ 1;
    road.push
   }
  
  


}

function determineDirection(positionHexTile: HexTile, targetHexTile: HexTile, board: Board): number[]{

  if (positionHexTile.coords.q - targetHexTile.coords.q < 0 ) {
    let newCoords: HexCoords = {
      q: positionHexTile.coords.q + 1,
      r: positionHexTile.coords.r
    }
      if(isPassable(newCoords, board)) return [1,0]
      else return [0,1]}

  if (positionHexTile.coords.q - targetHexTile.coords.q > 0 ) return [-1,0]
  if (positionHexTile.coords.q - targetHexTile.coords.q === 0 ) {
    if(positionHexTile.coords.r - targetHexTile.coords.r < 0) return [0,1]
    if(positionHexTile.coords.r - targetHexTile.coords.r > 0) return [0,-1]
    if(positionHexTile.coords.r - targetHexTile.coords.r === 0) return [0,0]
  }

  function isPassable(newCoords: HexCoords, board: Board):boolean{
    if(board.tiles.find(tile => tile.coords === newCoords)?.passable) return true;
    return false; 
  }

}