
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { plainToClass } from 'class-transformer';
import { ForbiddenException } from '@/exception/forbidden.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(uuid: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ uuid });
  }

  async remove(uuid: number): Promise<void> {
    await this.usersRepository.delete(uuid);
  }

  /**
   * 判断用户名是否存在
   * @param username 用户名
   * @returns 是否存在用户
   */
  async findUserCountByUsername(username: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const count = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username: username })
        .getCount();
      return count > 0;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    return false;
  }
  async registerNewUser(user: IUser): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      // 返回前转换下，去除密码
      return plainToClass(User, newUser);
    } catch (error) {
      console.error(error);
      // 如果遇到错误，可以回滚事务
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.message);
    } finally {
      // 你需要手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }
}
