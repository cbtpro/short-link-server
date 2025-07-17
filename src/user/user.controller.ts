import {
  Body, Controller, Get, Post, Request, UseGuards
} from "@nestjs/common";
import { FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { SkipAuth } from "@/auth/auth.decorator";
import { crypt } from "@/utils/bcrypt";
import { ForbiddenException } from "@/exception/forbidden.exception";
import { AuthService } from "@/auth/auth.service";

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
  // @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Body() user: IUser) {
    if (!user) {
      return {
        code: 0,
        error: '登录信息不能为空',
        message: '登录信息不能为空',
        data: user,
      };
    }
    const authInfo = await this.authService.login(user);
    const responseBody: IResponseBody<IAuthInfo> = {
      code: 0,
      error: null,
      message: '登录成功！',
      data: authInfo,
    };
    return responseBody;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/info')
  getProfile(@Request() req: AuthenticatedRequest) {
    const responseBody: IResponseBody<IAuthInfo> = {
      code: 0,
      error: null,
      message: '登录成功！',
      data: req.user as any,
    };
    return responseBody;
  }
}