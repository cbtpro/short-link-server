import { Controller, Get } from "@nestjs/common";
import { CreateAccessLogDto } from './dto/create-access_logs.dto';
import { AccessLogService } from "./access_log.service";
import { AccessLog } from "./access_log.entity";

@Controller('/access-log')
export class AccessLogController {
  constructor(private accessLogService: AccessLogService) { }

  @Get('/all')
  async findAll(): Promise<AccessLog[]> {
    return this.accessLogService.findAll();
  }
}