import { Module } from '@nestjs/common'; // dekorator modulu
import { StatsController } from './stats.controller'; // kontroler statystyk
import { StatsService } from './stats.service'; // serwis statystyk
import { PrismaModule } from '../prisma/prisma.module'; // dostep do bazy
import { AuthModule } from '../auth/auth.module'; // potrzebny guard JWT

@Module({
  imports: [PrismaModule, AuthModule], // zaleznosci
  controllers: [StatsController], // rejestracja kontrolera
  providers: [StatsService], // rejestracja serwisu
})
export class StatsModule {}
