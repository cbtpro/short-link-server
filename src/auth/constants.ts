import { ConfigService } from "@nestjs/config";

export const getJwtConstants = (configService: ConfigService) => {
  const authConfig = configService.get<IAuthConfig>('auth');
  const {
    jwtAccessSecret = "access-secret",
    jwtRefreshSecret = "refresh-secret",
    jwtAccessExpiresIn = "15m",
    jwtRefreshExpiresIn = "7d",
  } = authConfig ?? {};
  return {
    secret: jwtAccessSecret,
    jwtAccessExpiresIn,
    jwtRefreshSecret,
    jwtRefreshExpiresIn,
  };
};