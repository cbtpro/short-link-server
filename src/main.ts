import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { logger } from '@/common/middleware/global.logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { registerDecryptPlugin } from './common/plugins/fastify-decrypt.plugin';

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
  // 处理数组参数
  app.use((req: any, res: any, next: any) => {
    for (const key in req.query) {
      if (key.endsWith('[]')) {
        const newKey = key.replace('[]', '');
        req.query[newKey] = req.query[key];
        delete req.query[key];
      }
    }
    next();
  });
  app
    .use(logger)
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
