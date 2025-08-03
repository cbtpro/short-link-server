import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OriginalLinkService } from './original_link.service';
import { JwtAuthGuard } from '@/auth/jwt.auth.guard';
import {
  QueryOriginalUrlsDto,
  QueryOriginalUrlsOptionsDto,
} from './dto/query-original-urls.dto';
import {
  BatchCreateOriginalLinkDto,
  BatchUpdateOriginalLinkDto,
  CreateOriginalLinkDto,
  UpdateOriginalLinkDto,
} from './dto/original_link.dts';
import { SkipEncryptionInterceptor } from '@/common/decorator/skip-encryption-interceptor.decorator';

@UseGuards(JwtAuthGuard)
@SkipEncryptionInterceptor()
@Controller('/original-link')
export class OriginalLinkController {
  constructor(private originalLinkService: OriginalLinkService) {}

  @Post()
  create(
    @Body() body: CreateOriginalLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const createdBy = req.user.uuid;
    return this.originalLinkService.create(body, createdBy);
  }

  @Post(':uuid')
  @HttpCode(200)
  findOne(@Param('uuid') uuid: string) {
    return this.originalLinkService.find(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateOriginalLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.update(uuid, body, updatedBy);
  }

  @Post('batch')
  createBatch(
    @Body() body: BatchCreateOriginalLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const createdBy = req.user.uuid;
    return this.originalLinkService.createBatch(body, createdBy);
  }

  @Put('batch')
  updateBatch(
    @Body() body: BatchUpdateOriginalLinkDto,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.updateBatch(body, updatedBy);
  }

  @Delete(':uuid')
  delete(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.remove(uuid, updatedBy);
  }

  @Post(':uuid/undo')
  undoRemove(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest<IUser>,
  ) {
    const updatedBy = req.user.uuid;
    return this.originalLinkService.undoRemove(uuid, updatedBy);
  }

  @Post('query')
  async findAll(@Body() body: QueryOriginalUrlsDto) {
    return this.originalLinkService.findAll(body);
  }

  @Post('options')
  async findSafeAll(@Body() body: QueryOriginalUrlsOptionsDto) {
    return this.originalLinkService.findOptions(body);
  }
}
