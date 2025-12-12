import { Module } from '@nestjs/common'; // dekorator modulu
import { GameService } from './game.service'; // logika gry
import { GameController } from './game.controller'; // endpointy gry
import { PlayerModule } from 'src/player/player.module'; // zaleznosc gracza
import { BoardModule } from 'src/board/board.module'; // zaleznosc planszy
import { UnitsModule } from 'src/units/units.module'; // zaleznosc jednostek
import { PrismaModule } from 'src/prisma/prisma.module'; // dostep do bazy

@Module({
  imports: [PlayerModule, BoardModule, UnitsModule, PrismaModule], // moduly zalezne
  controllers: [GameController], // rejestracja kontrolera
  providers: [GameService], // serwis gry
  exports: [GameService], // udostepnij serwis
})
export class GameModule {}
