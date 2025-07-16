export class CreateShortLinkDto {
  short_code?: string;
  custom_params?: string;
  access_password?: string;
  case_insensitive?: boolean;
  expires_at?: boolean;
  max_visits?: boolean;
  ip_whitelist?: string;
  ip_blacklist?: string;
  ua_whitelist?: string;
  ua_blacklist?: string;
  remark?: string;
}