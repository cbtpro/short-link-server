import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortLinkService } from './short_link.service';
import { ShortLinkController } from './short_link.controller';
import { ShortLink } from './short_link.entity';
import { SnowflakeModule } from '@/common/snowflake/snowflake.module';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     * 需要使用的其他模块在这里导入
     */
    TypeOrmModule.forFeature([ShortLink]),
    SnowflakeModule,
    // OriginalLinkModule,
  ],
  providers: [ShortLinkService],
  controllers: [ShortLinkController],
})
export class ShortLinkModule {}
