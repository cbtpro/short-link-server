
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortLinkService } from './short_link.service';
import { ShortLinkController } from './short_link.controller';
import { ShortLink } from './short_link.entity';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([ShortLink])
  ],
  providers: [ShortLinkService],
  controllers: [ShortLinkController],
})
export class ShortLinkModule { }
