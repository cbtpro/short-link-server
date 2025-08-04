import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { SkipEncryptionInterceptor } from '@/common/decorator/skip-encryption-interceptor.decorator';
import { Public } from '@/common/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @SkipEncryptionInterceptor()
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
