import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  RedisModule as NestRedisModule,
  RedisModuleOptions,
} from '@nestjs-modules/ioredis';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDBConfig>('db');
        return {
          type: dbConfig?.redis.type ?? 'single',
          url: `redis://${dbConfig?.redis.host}:${dbConfig?.redis.port}/${dbConfig?.redis.db}`,
          options: {
            redisOptions: {
              // password: '123456',
            },
          },
        } as RedisModuleOptions;
      },
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
