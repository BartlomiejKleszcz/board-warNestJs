import { Module } from '@nestjs/common'; // dekorator modulu
import { PrismaModule } from '../prisma/prisma.module'; // dostep do bazy
import { UserService } from './user.service'; // logika uzytkownikow

@Module({
  imports: [PrismaModule], // rejestracja prisma
  providers: [UserService], // serwis w kontenerze
  exports: [UserService], // udostepnij serwis innym modulom
})
export class UserModule {}
