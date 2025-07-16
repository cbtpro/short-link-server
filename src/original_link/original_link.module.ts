
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginalLinkService } from './original_link.service';
import { OriginalLinkController } from './original_link.controller';
import { OriginalLink } from './original_link.entity';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([OriginalLink])
  ],
  providers: [OriginalLinkService],
  controllers: [OriginalLinkController],
})
export class OriginalLinkModule { }
