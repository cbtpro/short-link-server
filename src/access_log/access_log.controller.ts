import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateAccessLogDto } from './dto/create-access_logs.dto';
import { AccessLogService } from "./access_log.service";
import { AccessLog } from "./access_log.entity";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";
import { LocalAuthGuard } from "@/auth/local-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('/access-log')
export class AccessLogController {
  constructor(private accessLogService: AccessLogService) { }

  @Post('/all')
  async findAll(): Promise<AccessLog[]> {
    return this.accessLogService.findAll();
  }
}