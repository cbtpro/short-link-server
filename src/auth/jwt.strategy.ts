import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getJwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

function safeJsonParse<T>(str: string): T {
  return JSON.parse(str) as T;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtConstants(configService).secret,
    });
  }

  async validate(payload: IUser) {
    const key = `login:user:${payload.uuid}`;
    const cachedUser = await this.redis.get(key);

    if (!cachedUser) {
      throw new UnauthorizedException('用户信息已过期或未登录');
    }

    const user = safeJsonParse<IUser>(cachedUser);
    return user; // 这个对象将被注入 req.user
  }
}
