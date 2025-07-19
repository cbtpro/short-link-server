import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from '@/app.service';
import { SkipEncryptionInterceptor } from '@/common/decorator/skip-encryption-interceptor.decorator';
import { FastifyRequest } from 'fastify';
import { User } from './users/users.entity';
import { JwtAuthGuard } from '@/auth/jwt.auth.guard';
interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}
// @UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
