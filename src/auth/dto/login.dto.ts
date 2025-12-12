import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'; // walidatory requestu

export class LoginDto {
  @IsEmail() // poprawny email
  email!: string; // login

  @IsNotEmpty() // wymagane
  @MinLength(6) // min 6 znakow
  password!: string; // haslo
}
