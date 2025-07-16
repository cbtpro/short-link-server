import { Controller, Get, UseGuards } from "@nestjs/common";
import { CreateShortLinkDto } from './dto/create-short_link.dto';
import { ShortLinkService } from "./short_link.service";
import { ShortLink } from "./short_link.entity";
import { AuthGuard } from "@nestjs/passport";
@UseGuards(AuthGuard('jwt'))
@Controller('/short-link')
export class ShortLinkController {
  constructor(private shortLinkService: ShortLinkService) { }

  @Get('/all')
  async findAll(): Promise<ShortLink[]> {
    return this.shortLinkService.findAll();
  }
}