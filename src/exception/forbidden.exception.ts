import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message?: string, code?: HttpStatus) {
    const msg = message ?? 'Forbidden';
    super(msg, code ?? HttpStatus.FORBIDDEN);
  }
}
