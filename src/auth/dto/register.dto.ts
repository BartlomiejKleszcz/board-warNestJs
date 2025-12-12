import {
  IsEmail, // walidacja email
  IsNotEmpty, // pole wymagane
  IsString, // musi byc string
  Matches, // regex
  MinLength, // minimalna dlugosc
} from 'class-validator';

export class RegisterDto {
  @IsEmail() // poprawny format email
  email!: string; // adres logowania

  @IsNotEmpty() // wymagane
  @MinLength(6) // min 6 znakow
  password!: string; // haslo rejestracji

  @IsString() // tekst
  @IsNotEmpty() // wymagane
  @MinLength(4) // min 4 znaki
  @Matches(/^[A-Za-z]+$/, {
    message: 'Login moze zawierac tylko litery (A-Z)', // komunikat walidacji
  })
  displayName!: string; // widoczna nazwa gracza

  @IsString() // hex/kolor
  @IsNotEmpty() // wymagane
  color!: string; // kolor gracza
}
