/*
  Warnings:

  - Added the required column `updatedAt` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('not_started', 'in_progress', 'finished', 'paused');

-- CreateEnum
CREATE TYPE "GameActionType" AS ENUM ('MOVE', 'ATTACK', 'END_TURN');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "stateJson" JSONB,
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'not_started',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "GameAction" (
    "id" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "type" "GameActionType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
