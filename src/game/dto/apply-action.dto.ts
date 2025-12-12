import { IsArray, IsIn, IsInt, IsObject, IsOptional } from 'class-validator'; // walidatory akcji
import type { GameActionType } from '../model/game-state'; // typ akcji gry

export class ApplyActionDto {
  @IsIn(['MOVE', 'ATTACK', 'END_TURN']) // dozwolone typy
  type!: GameActionType; // typ akcji

  @IsInt() // id gracza
  @IsOptional() // opcjonalne
  playerId?: number; // nadpisanie id gracza

  @IsObject() // dane akcji
  @IsOptional()
  payload?: Record<string, any>; // ladunek akcji

  @IsArray() // opcjonalne rzuty kościa
  @IsInt({ each: true })
  @IsOptional()
  rolls?: number[];
}
