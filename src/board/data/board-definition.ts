// src/board/data/board-definition.ts

import { HexTile, TerrainType } from '../domain/hex.types';
import GameBoard, { Board } from '../domain/board';

const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 30;
const SEED = 12345; // change seed to get other layouts; stays deterministic per seed

// Simple deterministic 2D noise (no external deps)
const hash = (q: number, r: number, seed: number): number => {
  const h = q * 374761393 + r * 668265263 + seed * 0x9e3779b1;
  return (h ^ (h >> 13)) >>> 0;
};

const noise2d = (q: number, r: number, seed: number): number => {
  const h = hash(q, r, seed);
  return ((h * 1664525 + 1013904223) % 4294967296) / 4294967296;
};

function createTile(q: number, r: number): HexTile {
  // 1) water on the border - fixed placement
  if (q === 0 || q === BOARD_WIDTH - 1 || r === 0 || r === BOARD_HEIGHT - 1) {
    return {
      coords: { q, r },
      terrain: TerrainType.Water,
      passable: false,
      movementCost: 99,
    };
  }

  // 2) deterministic wavy river
  const riverOffset = (q % 4) - 2;
  if (r === 10 + riverOffset && q >= 5 && q <= 25) {
    return {
      coords: { q, r },
      terrain: TerrainType.Water,
      passable: false,
      movementCost: 99,
    };
  }

  // 3) city in the center
  const centerQ = Math.floor(BOARD_WIDTH / 2);
  const centerR = Math.floor(BOARD_HEIGHT / 2);
  if (q === centerQ && r === centerR) {
    return {
      coords: { q, r },
      terrain: TerrainType.City,
      passable: true,
      movementCost: 1,
    };
  }

  // 4) hills and forests - varied but repeatable via noise
  const hillScore = noise2d(q, r, SEED + 1);
  const forestScore = noise2d(q + 1000, r - 500, SEED + 2);

  if (hillScore > 0.72) {
    return {
      coords: { q, r },
      terrain: TerrainType.Hill,
      passable: true,
      movementCost: 3,
    };
  }

  if (forestScore > 0.58) {
    return {
      coords: { q, r },
      terrain: TerrainType.Forest,
      passable: true,
      movementCost: 2,
    };
  }

  // 5) plains elsewhere
  return {
    coords: { q, r },
    terrain: TerrainType.Plain,
    passable: true,
    movementCost: 1,
  };
}

const tiles: HexTile[] = [];

for (let q = 0; q < BOARD_WIDTH; q++) {
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    tiles.push(createTile(q, r));
  }
}

export const DEFAULT_BOARD: GameBoard = {
  tiles,
  getHexTile() {
    return tiles;
  },
  getNeighbors: function (tile: HexTile, board: Board): HexTile[] {
    throw new Error('Function not implemented.');
  }
};
