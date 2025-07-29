import { Body, Controller, Request, Get, Post, UseGuards } from "@nestjs/common";
import { QuerySafeShortUrlsDto } from "./dto/query-original-urls.dto";
import { ShortLinkService } from "./short_link.service";
import { ShortLink } from "./short_link.entity";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";
import { CreateSafeShortLinkDto } from "./dto/safe_short_link.dts";
import { QueryOriginalUrlsDto } from "@/original_link/dto/query-original-urls.dto";
import { OriginalLinkService } from "@/original_link/original_link.service";

@UseGuards(JwtAuthGuard)
@Controller('/safe-short-link')
export class ShortLinkController {
  constructor(
    private shortLinkService: ShortLinkService,
  ) { }

  @Post()
  create(@Body() body: CreateSafeShortLinkDto, @Request() req: AuthenticatedRequest) {
    const createdBy = req.user.uuid;
    return this.shortLinkService.create(body, createdBy);
  }

  @Post('query')
  async findAll(@Body() body: QuerySafeShortUrlsDto) {
    return this.shortLinkService.findAll(body);
  }
}