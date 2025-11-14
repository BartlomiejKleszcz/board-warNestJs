import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";
import * as unitTypes from "../domain/unit.types";

export class CreateUnitDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    id: unitTypes.UnitName;
    @ApiProperty()
    @IsInt()
    maxHp: number;
    @ApiProperty()
    @IsInt()
    meleeAttack: number
    @ApiProperty()
    @IsInt()
    rangedAttack: number;
    @ApiProperty()
    @IsInt()
    attackRange: number;
    @ApiProperty()
    @IsInt()
    defense: number;
    @ApiProperty()
    @IsInt()
    speed: number;
    @ApiProperty()
    @IsInt()
    cost: number;
}