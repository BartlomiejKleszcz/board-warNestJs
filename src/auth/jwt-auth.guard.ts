import { Injectable } from '@nestjs/common'; // dekorator DI
import { AuthGuard } from '@nestjs/passport'; // wbudowany guard passport

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // proxy guard wykorzystujacy strategie jwt
