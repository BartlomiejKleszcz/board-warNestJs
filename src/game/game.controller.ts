import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation } from 'node_modules/@nestjs/swagger/dist';
import { CreateSoloGameDto } from './dto/create-solo-game.dto';

@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService){}

    @Post('solo')
    @ApiOperation({summary: 'generate standard solo game'})
    createSoloGame(@Body() dto: CreateSoloGameDto){
        const game = this.gameService.createSoloGame(dto);
        return game;
    }


}
