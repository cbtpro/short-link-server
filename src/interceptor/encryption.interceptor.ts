import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from '@/services/encryption.service';
import { SKIP_ENCRYPTION_INTERCEPTOR_KEY } from '@/common/decorator/skip-encryption-interceptor.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export default class EncryptionInterceptor implements NestInterceptor {
  constructor(private readonly encryptionService: EncryptionService, private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * 跳过加密拦截
     */
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_ENCRYPTION_INTERCEPTOR_KEY,
      [
        context.getHandler(), // 方法上的元数据
        context.getClass(),   // 控制器上的元数据
      ],
    );

    if (skip) {
      return next.handle(); // 跳过拦截逻辑
    }
    return next.handle().pipe(
      map((data) => {
        return {
          ciphertext: this.encryptionService.encryptData(data),
        };
      }),
    );
  }
}
