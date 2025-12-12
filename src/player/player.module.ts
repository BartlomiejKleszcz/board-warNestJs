import { Module } from '@nestjs/common'; // dekorator modulu
import { PlayerService } from './player.service'; // logika gracza
import { PlayerController } from './player.controller'; // endpointy gracza
import { UnitsModule } from 'src/units/units.module'; // zaleznosc jednostki
import { PlayerRepositoryAdapter } from 'src/infrastructure/PlayerRepositoryAdapter'; // adapter repo
import { PrismaModule } from 'src/prisma/prisma.module'; // dostep do bazy

@Module({
  imports: [UnitsModule, PrismaModule], // moduly wspolne
  providers: [PlayerService, PlayerRepositoryAdapter], // serwis + repo
  controllers: [PlayerController], // kontroler REST
  exports: [PlayerService], // udostepnij serwis
})
export class PlayerModule {}
