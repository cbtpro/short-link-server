import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '@/utils/bcrypt';
import { plainToClass } from 'class-transformer';
import { User } from '@/users/users.entity';
import { ForbiddenException } from '../exception/forbidden.exception';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) { }
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new ForbiddenException('用户名或密码错误！');
    }
    if (user.enabled !== 1) {
      throw new ForbiddenException('用户已被禁用！');
    }
    if (user.deleted === 1) {
      throw new ForbiddenException('用户已被删除！');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('用户名或密码错误！');
    }
    return plainToClass(User, user);
  }
  async signIn(user: User) {
    const payload = { username: user.username, uuid: user.uuid };

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

      // 可以校验用户是否还存在
      const user = await this.usersService.findUserByUuid(payload.uuid);
      if (!user || user.enabled !== 1 || user?.deleted === 1) {
        throw new UnauthorizedException('用户不存在');
      }

      const newPayload = {
        username: user.username,
        uuid: user.uuid, // 或 user.id
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: jwtAccessSecret,
        expiresIn: jwtAccessExpiresIn,
      });

      // 可选：刷新 refreshToken
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: jwtRefreshSecret,
        expiresIn: jwtRefreshExpiresIn,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      } as IAuthInfo;

    } catch (e) {
      throw new UnauthorizedException('登录信息已失效');
    }
  }
}
