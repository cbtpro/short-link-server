import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        error = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = Array.isArray(resObj.message) ? resObj.message[0] : resObj.message || '请求错误';
        error = resObj.error || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // 打印错误日志（建议仅开发环境）
    console.error('全局异常:', exception);

    const responseBody = {
      code: -1,
      error,
      message,
      data: null,
      
    };

    response.code(status).type('application/json').send(responseBody);
  }
}
