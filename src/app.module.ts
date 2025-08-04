import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import LoggingInterceptor from './interceptor/logging.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EncryptionService } from '@/services/encryption.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OriginalLinkModule } from './original_link/original_link.module';
import { ShortLinkModule } from './short_link/short_link.module';
import { AccessLogModule } from './access_log/access_log.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/jwt.auth.guard';
import { AllExceptionsFilter } from '@/common/interceptor/all-exceptions.filter';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDBConfig>('db');
        return {
          name: 'short_links',
          type: 'mysql',
          host: dbConfig?.mysql.url,
          port: dbConfig?.mysql.port,
          username: dbConfig?.mysql.username,
          password: dbConfig?.mysql.password,
          database: dbConfig?.mysql.database,
          autoLoadEntities: true,
          logging: false,
          /**
           * 自动扫描所有实体
           */
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          /**
           * synchronize会创建表结构，建议关闭
           */
          synchronize: dbConfig?.mysql.synchronize ?? false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    OriginalLinkModule,
    ShortLinkModule,
    AccessLogModule,
  ],
  controllers: [AppController],
  providers: [
    EncryptionService,
    /**
     * 注册全局Jwt校验如果不需要校验的，请加@Public，比如登录
     */
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    /**
     * 注册全局加密拦截器
     */
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: EncryptionInterceptor,
    // },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
