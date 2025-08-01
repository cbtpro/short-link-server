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
        const resObj = res as { message?: string | string[]; error?: string };

        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(',');
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        } else {
          message = '请求错误';
        }

        error = resObj.error ?? message;
      }
    }

    // 打印错误日志（建议仅开发环境）
    console.error('全局异常:', {
      method: request.method,
      url: request.url,
      ip: request.ip,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers,
      exception,
    });

    const responseBody = {
      code: -1,
      error,
      message,
      data: null,
    };

    response.code(status).type('application/json').send(responseBody);
  }
}
