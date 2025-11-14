import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayerController {

    private readonly playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    @Post('create')
    @ApiOperation({ summary: 'Create a new player' })
    @ApiResponse({ status: 201, description: 'The player has been successfully created.' })
    createPlayer(@Body() createPlayerDto: CreatePlayerDto)  {
        this.playerService.createPlayer('Player1', 'Red');
    }

    @Get()
    @ApiOperation({ summary: 'Get all players' })
    @ApiResponse({ status: 200, description: 'List of all players.' })
    getAllPlayers() {
        return this.playerService.findall();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get player by ID' })
    @ApiResponse({ status: 200, description: 'The player with the specified ID.' })
    getPlayerById(@Param('id') id: number) {
        return this.playerService.findById(1);
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Update player details' })
    @ApiResponse({ status: 200, description: 'The player has been successfully updated.' })
    updatePlayer(@Param('id') id: number, @Body() updatePlayerDto: CreatePlayerDto) {
        return this.playerService.updatePlayer(id, updatePlayerDto.name, updatePlayerDto.color);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete a player by ID' })
    @ApiResponse({ status: 200, description: 'The player has been successfully deleted.' })
    deletePlayer(@Param('id') id: number) {
        return this.playerService.deletePlayer(id);
    }

}
