import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuerySafeShortUrlsDto } from './dto/query-original-urls.dto';
import { ShortLinkService } from './short_link.service';
import { JwtAuthGuard } from '@/auth/jwt.auth.guard';
import {
  BatchCreateSafeShortLinkDto,
  BatchUpdateSafeShortLinkDto,
  CreateSafeShortLinkDto,
  UpdateSafeShortLinkDto,
} from './dto/safe_short_link.dts';
import { SkipEncryptionInterceptor } from '@/common/decorator/skip-encryption-interceptor.decorator';

@UseGuards(JwtAuthGuard)
@SkipEncryptionInterceptor()
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
    return this.shortLinkService.findList(body);
  }

  @Post(':uuid')
  @HttpCode(200)
  async findOne(@Param('uuid') uuid: string) {
    return this.shortLinkService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateSafeShortLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.shortLinkService.update(uuid, body, updatedBy);
  }

  @Post('batch')
  createBatch(
    @Body() body: BatchCreateSafeShortLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const createdBy = req.user.uuid;
    return this.shortLinkService.createBatch(body, createdBy);
  }

  @Put('batch')
  updateBatch(
    @Body() body: BatchUpdateSafeShortLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.shortLinkService.updateBatch(body, updatedBy);
  }
  @Delete(':uuid')
  delete(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.shortLinkService.remove(uuid, updatedBy);
  }

  @Post(':uuid/undo')
  undoRemove(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.shortLinkService.undoRemove(uuid, updatedBy);
  }
}
