import { Module } from '@nestjs/common'; // dekorator modulu
import { UnitsService } from './units.service'; // serwis jednostek
import { UnitsController } from './units.controller'; // kontroler jednostek

@Module({
  providers: [UnitsService], // rejestracja serwisu
  controllers: [UnitsController], // rejestracja kontrolera
  exports: [UnitsService], // udostepnij serwis
})
export class UnitsModule {}
