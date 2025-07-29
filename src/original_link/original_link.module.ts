
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginalLinkService } from './original_link.service';
import { OriginalLinkController } from './original_link.controller';
import { OriginalLink } from './original_link.entity';
import { SnowflakeModule } from '@/common/snowflake/snowflake.module';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([OriginalLink]),
    SnowflakeModule,
  ],
  providers: [
    OriginalLinkService,
  ],
  exports: [
    // 其他模块需要使用 OriginalLinkService 时，导出该服务
    // OriginalLinkService
  ],
  controllers: [OriginalLinkController],
})
export class OriginalLinkModule { }
