import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PlayerModule } from 'src/player/player.module';
import { BoardModule } from 'src/board/board.module';
import { UnitsModule } from 'src/units/units.module';

@Module({
  imports: [PlayerModule, BoardModule, UnitsModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
