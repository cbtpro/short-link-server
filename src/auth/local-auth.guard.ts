import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 登录守卫
 * 用户登录时使用
 * 使用用户名和密码（比如来自 body）验证用户身份
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
