import { IsInt, IsOptional } from 'class-validator'; // request validators

export class ApplyAiTurnDto {
  @IsInt()
  @IsOptional()
  playerId?: number;
}
