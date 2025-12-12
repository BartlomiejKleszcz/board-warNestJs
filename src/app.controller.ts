import { Controller, Get } from '@nestjs/common'; // dekoratory Nest
import { AppService } from './app.service'; // serwis root

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // DI serwisu

  @Get()
  getHello(): string {
    return this.appService.getHello(); // zwroc prosty ping
  }
}
