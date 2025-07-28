import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { OriginalLinkService } from "./original_link.service";
import { OriginalLink } from "./original_link.entity";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";
import { QueryOriginalUrlsDto } from "./dto/query-original-urls.dto";
import { BatchCreateOriginalLinkDto, BatchUpdateOriginalLinkDto, CreateOriginalLinkDto, UpdateOriginalLinkDto } from "./dto/original_link.dts";
import { SkipEncryptionInterceptor } from "@/common/decorator/skip-encryption-interceptor.decorator";
import { SkipResponseInterceptor } from "@/common/interceptor/skip-response.interceptor.decorator";

@UseGuards(JwtAuthGuard)
@Controller('/original-link')
export class OriginalLinkController {
  constructor(private originalLinkService: OriginalLinkService) { }

  @Post()
  create(@Body() body: CreateOriginalLinkDto, @Request() req: AuthenticatedRequest) {
    const createdBy = req.user.uuid;
    return this.originalLinkService.create(body, createdBy);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.originalLinkService.findOne(uuid);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() body: UpdateOriginalLinkDto, @Request() req: AuthenticatedRequest) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.update(uuid, body, updatedBy);
  }

  @Post('batch')
  createBatch(@Body() body: BatchCreateOriginalLinkDto, @Request() req: AuthenticatedRequest) {
    const createdBy = req.user.uuid;
    return this.originalLinkService.createBatch(body, createdBy);
  }

  @Put('batch')
  updateBatch(@Body() body: BatchUpdateOriginalLinkDto, @Request() req: AuthenticatedRequest) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.updateBatch(body, updatedBy);
  }
  
  @Post('query')
  async findAll(@Body() body: QueryOriginalUrlsDto) {
    return this.originalLinkService.findAll(body);
  }
}