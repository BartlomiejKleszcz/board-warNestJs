import { Controller, Param, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit-dto';
import type { UnitName } from './domain/unit.types';
import { UnitsService } from './units.service';
import { GameUnit } from './domain/game-unit';

@Controller('units')
export class UnitsController {
    constructor(private readonly unitsService: UnitsService) {}

    @Post('create:id')
    createUnit(@Param('id') id: UnitName ): CreateUnitDto {
        
        const unit: GameUnit =this.unitsService.createUnit(id);

        return unit
    }
}
