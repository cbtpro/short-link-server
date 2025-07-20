
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { comparePassword } from '../utils/bcrypt';
import { User } from './users.entity';
import { plainToClass } from 'class-transformer';
import { ForbiddenException } from '@/exception/forbidden.exception';
import { SnowflakeService } from '@/common/snowflake/snowflake.service';
import { DeletedStatus, EnabledStatus } from '@/common/constants';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly snowflakeService: SnowflakeService,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findUserByUuid(uuid: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ uuid });
  }
  findUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }
  findUserCountByUsername(username: string): Promise<number> {
    return this.usersRepository.count({
      where: { username }
    });
  }

  async findAllUserCount(): Promise<number> {
    // const count = await this.usersRepository
    //   .createQueryBuilder('user')
    //   .where('user.enabled = :enabled', { enabled: 1 })
    //   .andWhere('(user.deleted IS NULL OR user.deleted = 0)')
    //   .getCount();
    const count = await this.usersRepository.count({
      where: [
        { enabled: EnabledStatus.Enabled, deleted: undefined },
        { enabled: EnabledStatus.Enabled, deleted: DeletedStatus.NotDeleted },
      ],
    });
    return count;
  }

  async remove(uuid: string): Promise<void> {
    await this.usersRepository.update({ uuid }, { deleted: 1 });
  };
  /**
   * 根据用户名和密码查找用户（用于登录）
   * @param username 用户名
   * @param password 密码（明文）
   */
  async findByUsernameAndPassword(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new ForbiddenException('用户不存在或密码错误');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('用户不存在或密码错误');
    }
    return user; // 可使用 class-transformer 去除敏感字段
  };
  /**
   * 数据库事务提交注册用户
   * @param userDto 用户信息
   * @returns
   */
  async registerNewUser(userDto: IUser): Promise<User> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.usersRepository.create({
        ...userDto,
        uuid: this.snowflakeService.generateId(),
        createdTime: new Date(),
        enabled: 1,
      });

      const newUser = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      // 返回前转换下，去除敏感信息如密码
      return plainToClass(User, newUser);
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 失败回滚
      console.error('[registerNewUser]', error);
      throw new ForbiddenException(error.message || '注册用户失败');
    } finally {
      await queryRunner.release(); // 释放资源
    }
  }

}
