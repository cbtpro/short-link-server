
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLogService } from './access_log.service';
import { AccessLogController } from './access_log.controller';
import { AccessLog } from './access_log.entity';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([AccessLog])
  ],
  providers: [AccessLogService],
  controllers: [AccessLogController],
})
export class AccessLogModule { }
