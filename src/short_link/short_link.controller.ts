import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { QuerySafeShortUrlsDto } from './dto/query-original-urls.dto';
import { ShortLinkService } from './short_link.service';
import { JwtAuthGuard } from '@/auth/jwt.auth.guard';
import { CreateSafeShortLinkDto } from './dto/safe_short_link.dts';

@UseGuards(JwtAuthGuard)
@Controller('/safe-short-link')
export class ShortLinkController {
  constructor(private shortLinkService: ShortLinkService) {}

  @Post()
  async create(
    @Body() body: CreateSafeShortLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const createdBy = req.user.uuid;
    return await this.shortLinkService.create(body, createdBy);
  }

  @Post('query')
  async findAll(@Body() body: QuerySafeShortUrlsDto) {
    return this.shortLinkService.findAll(body);
  }
}
