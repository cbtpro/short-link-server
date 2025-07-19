import { Controller, Get, UseGuards } from "@nestjs/common";
import { OriginalLinkService } from "./original_link.service";
import { OriginalLink } from "./original_link.entity";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('/original-link')
export class OriginalLinkController {
  constructor(private originalLinkService: OriginalLinkService) { }

  @Get('/all')
  async findAll(): Promise<OriginalLink[]> {
    return this.originalLinkService.findAll();
  }
}