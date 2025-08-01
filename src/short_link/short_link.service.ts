import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ShortLink } from './short_link.entity';
import { QuerySafeShortUrlsDto } from './dto/query-original-urls.dto';
import { OrderType } from '@/common/dto/pagination-query.dto';
import { CreateSafeShortLinkDto } from './dto/safe_short_link.dts';
import { SnowflakeService } from '@/common/snowflake/snowflake.service';

@Injectable()
export class ShortLinkService {
  constructor(
    @InjectRepository(ShortLink)
    private shortLinkRepository: Repository<ShortLink>,
    private dataSource: DataSource,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  /**
   * 单条新增原始链接记录
   * @param data - 创建原始链接所需的数据，类型为 CreateOriginalLinkDto
   * @returns 新增成功后的原始链接记录，类型为 OriginalLink
   */
  async create(
    data: CreateSafeShortLinkDto,
    createdBy?: string,
  ): Promise<ShortLink> {
    // 创建一个查询运行器，用于管理数据库事务
    const queryRunner = this.dataSource.createQueryRunner();

    // 连接到数据库
    await queryRunner.connect();
    // 开始一个数据库事务
    await queryRunner.startTransaction();

    try {
      // 使用传入的数据创建一个新的原始链接实体，同时生成 UUID、设置创建时间和启用状态
      const originalLink = this.shortLinkRepository.create({
        ...data,
        uuid: this.snowflakeService.generateId(),
        createdTime: new Date(),
        createdBy,
      });

      // 使用查询运行器的管理器保存新创建的原始链接实体
      const newOriginalLink = await queryRunner.manager.save(
        ShortLink,
        originalLink,
      );

      // 提交数据库事务
      await queryRunner.commitTransaction();

      // 返回前转换下，去除敏感信息如密码
      return newOriginalLink;
    } catch (error) {
      // 发生错误时，回滚数据库事务
      await queryRunner.rollbackTransaction();
      // 打印错误日志
      console.error('[createOriginalLink]', error);

      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        // mysql | postgres 唯一约束失败
        throw new ConflictException('该短链接已存在');
      }

      // 抛出内部服务器错误异常，表示新增短链接失败
      throw new InternalServerErrorException('新增短链接失败');
    } finally {
      // 无论操作成功或失败，都释放查询运行器占用的资源
      await queryRunner.release();
    }
  }
  async findAll(query: QuerySafeShortUrlsDto) {
    const qb = this.shortLinkRepository.createQueryBuilder('url');

    // 关键词模糊查询
    if (query.keyword) {
      qb.andWhere('url.short_code LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    // 启用状态
    if (query.enabled !== undefined) {
      qb.andWhere('url.enabled = :enabled', { enabled: query.enabled });
    }

    // 删除状态
    if (query.deleted !== undefined) {
      if (query.deleted === 0) {
        qb.andWhere('(url.deleted = 0 OR url.deleted IS NULL)');
      } else if (query.deleted === 1) {
        qb.andWhere('url.deleted = 1');
      }
    }

    // 创建者
    if (query.createdBy) {
      qb.andWhere('url.createdBy = :createdBy', { createdBy: query.createdBy });
    }

    // 创建时间范围
    if (Array.isArray(query.createdTime) && query.createdTime.length === 2) {
      qb.andWhere('url.createdTime BETWEEN :createdStart AND :createdEnd', {
        createdStart: query.createdTime[0],
        createdEnd: query.createdTime[1],
      });
    }

    // 更新时间范围
    if (Array.isArray(query.updatedTime) && query.updatedTime.length === 2) {
      qb.andWhere('url.updatedTime BETWEEN :updatedStart AND :updatedEnd', {
        updatedStart: query.updatedTime[0],
        updatedEnd: query.updatedTime[1],
      });
    }

    // 多字段排序：优先使用 sortList
    if (Array.isArray(query.sortList) && query.sortList.length > 0) {
      for (const sortItem of query.sortList) {
        // 注意字段别名前缀
        const field = sortItem.field.startsWith('url.')
          ? sortItem.field
          : `url.${sortItem.field}`;
        qb.addOrderBy(field, sortItem.order);
      }
    } else {
      // 向后兼容 orderBy + order（默认 createdTime DESC）
      const order = query.order ?? OrderType.DESC;
      const orderBy = query.orderBy ?? 'url.createdTime';
      qb.orderBy(orderBy, order);
    }
    // 排序与分页
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await qb.getManyAndCount();
    return { items: data, total };
  }

  findOne(uuid: string): Promise<ShortLink | null> {
    return this.shortLinkRepository.findOneBy({ uuid });
  }

  async remove(uuid: string): Promise<void> {
    await this.shortLinkRepository.delete(uuid);
  }
}
