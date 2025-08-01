import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE_INTERCEPTOR_KEY } from './skip-response.interceptor.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * 跳过返回体封装拦截
     */
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_INTERCEPTOR_KEY,
      [
        context.getHandler(), // 方法上的元数据
        context.getClass(), // 控制器上的元数据
      ],
    );

    if (skip) {
      return next.handle(); // 跳过拦截逻辑
    }
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          error: null,
          message: 'success',
          data: data as T,
        };
      }),
    );
  }
}
