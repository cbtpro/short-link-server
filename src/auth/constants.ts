import { getExpireTime } from "@/utils/time";
import { ConfigService } from "@nestjs/config";
import type { StringValue } from "ms";

export const getJwtConstants = (configService: ConfigService) => {
  const authConfig = configService.get<IAuthConfig>('auth');
  const {
    jwtAccessSecret = "access-secret",
    jwtRefreshSecret = "refresh-secret",
    jwtAccessExpiresIn = "15m",
    jwtRefreshExpiresIn = "7d",
  } = authConfig ?? {};
  const {
    expireDate: jwtAccessExpiresInDate,
    expireAt: jwtAccessExpiresInExpireAt,
    expireInSeconds: jwtAccessExpireInSeconds,
  } = getExpireTime(jwtAccessExpiresIn as StringValue);
  const {
    expireDate: jwtRefreshExpiresInDate,
    expireAt: jwtRefreshExpiresInExpireAt,
    expireInSeconds: jwtRefreshExpireInSeconds,
  } = getExpireTime(jwtRefreshExpiresIn as StringValue);
  return {
    secret: jwtAccessSecret,
    jwtAccessExpiresIn,
    jwtAccessExpiresInDate,
    jwtAccessExpiresInExpireAt,
    jwtAccessExpireInSeconds,
    jwtRefreshSecret,
    jwtRefreshExpiresIn,
    jwtRefreshExpiresInDate,
    jwtRefreshExpiresInExpireAt,
    jwtRefreshExpireInSeconds,
  };
};