import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils/bcrypt';
import { plainToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { ForbiddenException } from '../exception/forbidden.exception';
import { getJwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }
  async validateUser(username: string, password: string): Promise<User> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const user = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username: username })
        .getOne();
      if (!user) {
        throw new ForbiddenException('用户名或密码错误！');
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new ForbiddenException('用户名或密码错误！');
      }
      return plainToClass(User, user);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    const authConfig = this.configService.get<IAuthConfig>('auth');
    const {
      jwtAccessSecret,
      jwtAccessExpiresIn,
      jwtRefreshSecret,
      jwtRefreshExpiresIn
    } = authConfig ?? {};
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtAccessSecret,
      expiresIn: jwtAccessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: jwtRefreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    } as IAuthInfo;
  }

  async refreshToken(token: string) {
    try {
      const authConfig = this.configService.get<IAuthConfig>('auth');
      const {
        jwtAccessSecret,
        jwtAccessExpiresIn,
        jwtRefreshSecret,
        jwtRefreshExpiresIn
      } = authConfig ?? {};
      const payload = this.jwtService.verify(token, {
        secret: jwtRefreshSecret,
      });

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        {
          secret: jwtAccessSecret,
          expiresIn: jwtAccessExpiresIn,
        },
      );

      return newAccessToken;
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }


}
