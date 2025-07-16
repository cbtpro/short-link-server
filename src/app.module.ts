import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { OriginalLinkModule } from './original_link/original_link.module';
import { ShortLinkModule } from './short_link/short_link.module';
import { AccessLogModule } from './access_log/access_log.module';

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
      useFactory: async (configService: ConfigService) => {
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
          /**
           * 自动扫描所有实体
           */
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          /**
           * synchronize会创建表结构，建议关闭
           */
          // synchronize: true,
        };
      },
    }),
    UsersModule,
    OriginalLinkModule,
    ShortLinkModule,
    AccessLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
