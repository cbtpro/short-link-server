import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  private generateTokens(payload: {
    username: string;
    uuid: string;
  }): IAuthInfo {
    const authConfig = this.configService.get<IAuthConfig>('auth');
    const {
      jwtAccessSecret,
      jwtAccessExpiresIn,
      jwtRefreshSecret,
      jwtRefreshExpiresIn,
    } = authConfig ?? {};

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtAccessSecret,
      expiresIn: jwtAccessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken } as IAuthInfo;
  }

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
  signIn(user: User) {
    const payload = { username: user.username, uuid: user.uuid };

    return this.generateTokens(payload);
  }

  async refreshToken(token: string) {
    try {
      const authConfig = this.configService.get<IAuthConfig>('auth');
      const { jwtRefreshSecret } = authConfig ?? {};

      const payload = this.jwtService.verify<{ uuid: string }>(token, {
        secret: jwtRefreshSecret,
      });

      const user = await this.usersService.findUserByUuid(payload.uuid);
      if (!user || user.enabled !== 1 || user.deleted === 1) {
        throw new UnauthorizedException('用户不存在或已被禁用');
      }

      const newPayload = {
        username: user.username,
        uuid: user.uuid,
      };

      return this.generateTokens(newPayload);
    } catch (error) {
      console.error(error);
      // 只抛简洁信息，避免泄露内部堆栈
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }
}
