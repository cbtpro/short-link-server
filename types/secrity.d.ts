interface ISecrityConfig {
  ['secret_key']: string;
}

interface IAuthConfig {
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
}