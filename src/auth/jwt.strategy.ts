import { Injectable } from '@nestjs/common'; // wstrzykiwanie strategii
import { PassportStrategy } from '@nestjs/passport'; // baza strategii
import { ExtractJwt, Strategy } from 'passport-jwt'; // narzedzia JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // czytaj token z Bearer
      ignoreExpiration: false, // wymagaj waznego tokenu
      secretOrKey: process.env.JWT_SECRET || 'change-me', // klucz walidacji
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email }; // user obiekt ladowany do req.user
  }
}
