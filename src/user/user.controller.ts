import {
  Body, Controller, Get, Post, Req, Request, Res, UseGuards
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from "@/user/user.service";
import { User } from "@/user/user.entity";
import { SkipAuth } from "@/auth/auth.decorator";
import { crypt } from "@/utils/bcrypt";
import { ForbiddenException } from "@/exception/forbidden.exception";
import { AuthService } from "@/auth/auth.service";
import { SkipEncryptionInterceptor } from "@/common/decorator/skip-encryption-interceptor.decorator";
import { UserLoginDto } from "@/user/dto/user-login.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { BaseResponseDto } from "@/common/dto/base-response.dto";
import { LoginResponseDto } from "@/user/dto/login-response.dto";
import { LocalAuthGuard } from "@/auth/local-auth.guard";
import { JwtAuthGuard } from "@/auth/jwt.auth.guard";
import { SkipResponseInterceptor } from "@/common/interceptor/skip-response.interceptor.decorator";

interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('/all')
  // async findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  @SkipAuth()
  @Post('/auth/register')
  async register(@Body() user: IUser): Promise<IResponseBody<User>> {
    try {
      const password = await crypt(user.password);
      const cryptUser = Object.assign(user, { password });
      const isExist = await this.userService.findUserCountByUsername(
        user.username,
      );
      if (!isExist) {
        const newUser = await this.userService.registerNewUser(cryptUser);
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

  @SkipAuth()
  // @UseGuards(LocalAuthGuard)
  // @SkipEncryptionInterceptor()
  @Post('/auth/login')
  @ApiOkResponse({
    description: '登录成功返回 token',
    type: BaseResponseDto<LoginResponseDto>,
  })
  async login(
    @Body() user: UserLoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const authInfo = await this.authService.login(user);
    const { accessToken, refreshToken = '' } = authInfo;
    (response as any).setCookie('refreshToken', refreshToken, {
      // domain: 'example.com', // same options as before
      path: '/',
    });
    return {
      accessToken
    };
  }

  @Get('/auth/codes')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(LocalAuthGuard)
  @SkipEncryptionInterceptor()
  @ApiOkResponse({
    description: '获取accessCode权限码',
    type: BaseResponseDto<string>,
  })
  async getAccessCode(@Request() req: AuthenticatedRequest) {
    return '0';
  }

  // @UseGuards(JwtAuthGuard)
  // @SkipEncryptionInterceptor()
  @SkipResponseInterceptor()
  @Post('/auth/refresh')
  async refresh(@Req() request: FastifyRequest) {
    const refreshToken = ((request as any).cookies as any)?.refreshToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('/auth/logout')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    description: '注销',
    type: BaseResponseDto<string>,
  })
  async logout(@Request() req: AuthenticatedRequest) {
    console.log(req);
    return '登出成功';
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('/user/info')
  getProfile(@Request() req: AuthenticatedRequest) {
    const { uuid } = req.user;
    const userInfo = this.userService.findOne(uuid);
    return userInfo;
    // return req.user;
  }
}