import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { getJwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    UsersModule,
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
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  /**
   * 导出给其他模块用
   */
  exports: [AuthService, JwtStrategy],
  controllers: [],
})
export class AuthModule {}
