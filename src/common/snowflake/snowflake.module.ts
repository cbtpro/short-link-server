// src/common/snowflake/snowflake.module.ts
import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';

@Module({
  providers: [SnowflakeService],
  exports: [SnowflakeService], // 重要：导出供其他模块使用
})
export class SnowflakeModule { }
