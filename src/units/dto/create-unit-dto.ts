import { IsInt, IsString } from "class-validator";

export class CreateUnitDto {
    @IsString()
    name: string;
    @IsInt()
    maxHp: number;
    @IsInt()
    meleeAttack: number
    @IsInt()
    rangedAttack: number;
    @IsInt()
    attackRange: number;
    @IsInt()
    defense: number;
    @IsInt()
    speed: number;
    @IsInt()
    cost: number;
}