import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipEncryptionInterceptor } from './common/decorator/skip-encryption-interceptor.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @SkipEncryptionInterceptor()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
