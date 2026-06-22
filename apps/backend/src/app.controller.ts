import { All, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @All()
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  easterEgg() {}
}
