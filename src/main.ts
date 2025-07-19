import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { logger } from '@/common/middleware/global.logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { registerDecryptPlugin } from './common/plugins/fastify-decrypt.plugin';
// import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
// import { AllExceptionsFilter } from '@/common/interceptor/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    { abortOnError: false }
  );

  await app.register(fastifyCookie, {
    // secret: 'my-secret', // for cookies signature
  });

  const encryptionService = app.get(EncryptionService);
  const fastifyInstance = app.getHttpAdapter().getInstance();
  // 注册解密插件
  registerDecryptPlugin(fastifyInstance, encryptionService);

  app
    .use(logger)
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
  // const reflector = app.get(Reflector); // 手动获取 Reflector 实例
  // app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
