
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from '@/users/users.controller';
import { User } from './users.entity';
import { AuthService } from '@/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SnowflakeModule } from '@/common/snowflake/snowflake.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { getJwtConstants } from '@/auth/constants';
import { LocalStrategy } from '@/auth/local.strategy';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { secret, jwtAccessExpiresIn } = getJwtConstants(configService);
        return {
          secret,
          signOptions: {
            expiresIn: jwtAccessExpiresIn,
          },
        };
      },
    }),
    SnowflakeModule,
  ],
  providers: [UsersService, LocalStrategy, AuthService],
  exports: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule { }
