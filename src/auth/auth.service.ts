import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils/bcrypt';
import { plainToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { ForbiddenException } from '../exception/forbidden.exception';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username: username })
        .getOne();
      // await queryRunner.commitTransaction();
      if (!user) {
        throw new ForbiddenException('用户名或密码错误！');
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new ForbiddenException('用户名或密码错误！');
      }
      return plainToClass(User, user);
    } catch (error) {
      console.error(error);
      throw error;
      // await queryRunner.rollbackTransaction();
    } finally {
      // 你需要手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    } as IAuthInfo;
  }
}
