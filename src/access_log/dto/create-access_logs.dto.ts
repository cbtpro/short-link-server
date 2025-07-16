export class CreateAccessLogDto {

  originalLinkId: string;

  shortCode: string;

  customParams: string;

  accessPassword: string;

  caseInsensitive: number;

  expiresAt: Date;

  maxVisits: number;

  visitCount: number;
  ipWhitelist: string;

  ipBlacklist: string;

  uaWhitelist: string;

  uaBlacklist: string;

  remark: string;
}