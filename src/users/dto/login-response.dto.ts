import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌，用于身份验证', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌，用于获取新 accessToken', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  refreshToken: string;
}