import { Module } from '@nestjs/common'; // dekorator modulu Nest
import { BoardService } from './board.service'; // logika planszy
import { BoardController } from './board.controller'; // endpointy planszy

@Module({
  providers: [BoardService], // DI serwisu
  controllers: [BoardController], // rejestracja kontrolera
  exports: [BoardService], // udostepnij serwis innym modulom
})
export class BoardModule {}
