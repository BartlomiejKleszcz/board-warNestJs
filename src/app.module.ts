import { Module } from '@nestjs/common'; // dekorator modulu
import { ConfigModule } from '@nestjs/config'; // ladowanie zmiennych env
import { AppController } from './app.controller'; // kontroler root
import { AppService } from './app.service'; // serwis root
import { UnitsModule } from './units/units.module'; // modul jednostek
import { PlayerModule } from './player/player.module'; // modul graczy
import { BoardModule } from './board/board.module'; // modul planszy
import { GameModule } from './game/game.module'; // modul gry
import { PrismaModule } from './prisma/prisma.module'; // modul ORM
import { AuthModule } from './auth/auth.module'; // modul auth
import { UserModule } from './user/user.module'; // modul uzytkownikow
import { StatsModule } from './stats/stats.module'; // modul statystyk

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // udostepnij config w calym app
      envFilePath: ['.env'], // sciezka do pliku env
    }),
    UnitsModule,
    PlayerModule,
    BoardModule,
    GameModule,
    PrismaModule,
    AuthModule,
    UserModule,
    StatsModule,
  ],
  controllers: [AppController], // rejestracja kontrolera root
  providers: [AppService], // rejestracja serwisu root
})
export class AppModule {}
