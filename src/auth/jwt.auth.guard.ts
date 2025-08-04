import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/common/decorator/public.decorator';

/**
 * 鉴权守卫
 * 登录后访问受保护资源
 * 验证请求头中的 Bearer Token 是否有效
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest<IUser>(
    err: any,
    user: IUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): IUser {
    // 可以抛出一个基于info或者err参数的异常
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(
      'user',
      user,
      'info',
      info,
      // 'context',
      // context,
      'status',
      status,
    );
    return user;
  }
}
