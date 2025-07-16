import { Controller, Get } from "@nestjs/common";
import { CreateOriginalLinkDto } from './dto/create-original_link.dto';
import { OriginalLinkService } from "./original_link.service";
import { OriginalLink } from "./original_link.entity";

@Controller('/original-link')
export class OriginalLinkController {
  constructor(private originalLinkService: OriginalLinkService) { }

  @Get('/all')
  async findAll(): Promise<OriginalLink[]> {
    return this.originalLinkService.findAll();
  }
}