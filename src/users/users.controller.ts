import {
  Body, Controller, Get, Post, Req, Request, Res, UseGuards
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from "@/users/users.service";
import { User } from "@/users/users.entity";
import { Public } from '@/common/decorator/public.decorator';
import { crypt } from "@/utils/bcrypt";
import { getJwtConstants } from '@/auth/constants';
import { ForbiddenException } from "@/exception/forbidden.exception";
import { AuthService } from "@/auth/auth.service";
import { SkipEncryptionInterceptor } from "@/common/decorator/skip-encryption-interceptor.decorator";
import { UserLoginDto } from "@/users/dto/user-login.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { BaseResponseDto } from "@/common/dto/base-response.dto";
import { LoginResponseDto } from "@/users/dto/login-response.dto";
import { LocalAuthGuard } from "@/auth/local-auth.guard";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";
import { SkipResponseInterceptor } from "@/common/interceptor/skip-response.interceptor.decorator";

interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }


  @UseGuards(JwtAuthGuard)
  @Get('user/count')
  async findAll(): Promise<number> {
    return this.usersService.findAllUserCount();
  }

  @Public()
  @Post('auth/register')
  async register(@Body() user: UserLoginDto): Promise<IResponseBody<User>> {
    try {
      const password = await crypt(user.password);
      const cryptUser = Object.assign(user, { password });
      const isExist = await this.usersService.findUserCountByUsername(
        user.username,
      );
      if (!isExist) {
        const newUser = await this.usersService.registerNewUser(cryptUser);
        const responseBody: IResponseBody<User> = {
          code: 0,
          error: null,
          message: '注册成功！',
          data: newUser,
        };
        return responseBody;
      } else {
        throw new Error('用户名已存在');
      }
    } catch (error) {
      console.error(error);
      throw new ForbiddenException(error.message);
    }
  }

  @Public()
  @SkipResponseInterceptor()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Body() userDto: IUser,
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const user = req.user;
    const authInfo = await this.authService.signIn(user);
    const { accessToken, refreshToken } = authInfo;
    const { jwtRefreshExpireInSeconds = 7 * 24 * 60 * 60 * 1000 } = getJwtConstants(this.configService);
    (response as any)
      .code(200)
      .setCookie('refreshToken', refreshToken, {
        // domain: 'example.com', // same options as before
        path: '/',
        // expires: 'Wed, 21 Oct 2015 07:28:00 GMT',
        // maxAge: 60_000,
        maxAge: jwtRefreshExpireInSeconds,
      });
    return {
      accessToken
    };
  }

  @Get('auth/codes')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: '获取accessCode权限码',
    type: BaseResponseDto<string>,
  })
  async getAccessCode(@Request() req: AuthenticatedRequest) {
    return '0';
  }

  @Public()
  @SkipEncryptionInterceptor()
  @SkipResponseInterceptor()
  @Post('auth/refresh')
  async refresh(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const oldRefreshToken = ((request as any).cookies as any)?.refreshToken;
    const authInfo = await this.authService.refreshToken(oldRefreshToken);
    const { accessToken, refreshToken = '' } = authInfo;
    const { jwtRefreshExpireInSeconds = 7 * 24 * 60 * 60 * 1000 } = getJwtConstants(this.configService);
    (response as any)
      .code(200)
      .setCookie('refreshToken', refreshToken, {
        // domain: 'example.com', // same options as before
        path: '/',
        // expires: 'Wed, 21 Oct 2015 07:28:00 GMT',
        // maxAge: 60_000,
        maxAge: jwtRefreshExpireInSeconds,
      });
    return accessToken;
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: '注销',
    type: BaseResponseDto<string>,
  })
  async logout(@Request() req: AuthenticatedRequest) {
    console.log(req);
    return '登出成功';
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/info')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const { uuid } = req.user;
    const userInfo = await this.usersService.findUserByUuid(uuid);
    return userInfo;
    // return req.user;
  }
}