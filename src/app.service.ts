import { Injectable } from '@nestjs/common'; // dekorator serwisu

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'; // prosty ping API
  }
}
