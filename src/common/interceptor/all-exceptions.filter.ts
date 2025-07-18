import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response | FastifyReply>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      message = res.message || res;
      error = res.error || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    const responseBody = {
      code: -1,
      error: message,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    };
    (response as FastifyReply).code(status).send(responseBody);
  }
}
