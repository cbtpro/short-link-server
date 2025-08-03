import { ShortLinkDto } from '@/short_link/dto/short-link.dto';

export class OriginalLinkDto {
  id: string;
  originalUrl: string;
  enabled: boolean;
  createdTime: Date;
  updatedTime: Date;

  shortLinks: ShortLinkDto[]; // 嵌套 shortLinks
}
