import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ShortLink } from './short_link.entity';
import { QuerySafeShortUrlsDto } from './dto/query-original-urls.dto';
import { OrderType } from '@/common/dto/pagination-query.dto';
import {
  BatchCreateSafeShortLinkDto,
  BatchUpdateSafeShortLinkDto,
  CreateSafeShortLinkDto,
  UpdateSafeShortLinkDto,
} from './dto/safe_short_link.dts';
import { SnowflakeService } from '@/common/snowflake/snowflake.service';
import { DeletedStatus } from '@/common/constants';

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
      const newShortLink = await queryRunner.manager.save(
        ShortLink,
        originalLink,
      );

      // 提交数据库事务
      await queryRunner.commitTransaction();

      // 返回前转换下，去除敏感信息如密码
      return newShortLink;
    } catch (error) {
      // 发生错误时，回滚数据库事务
      await queryRunner.rollbackTransaction();
      // 打印错误日志
      console.error('[createShortLink]', error);

      // 抛出内部服务器错误异常，表示新增短链接失败
      throw new InternalServerErrorException(error, '新增链接失败');
    } finally {
      // 无论操作成功或失败，都释放查询运行器占用的资源
      await queryRunner.release();
    }
  }
  async createBatch(
    datas: BatchCreateSafeShortLinkDto,
    createdBy?: string,
  ): Promise<ShortLink[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entities = datas.items.map((data) =>
        this.shortLinkRepository.create({
          ...data,
          uuid: this.snowflakeService.generateId(),
          createdBy,
          createdTime: new Date(),
          enabled: 1,
        }),
      );

      const savedEntities = [];
      for (const entity of entities) {
        const saved = await queryRunner.manager.save(ShortLink, entity);
        savedEntities.push(saved);
      }

      await queryRunner.commitTransaction();
      return savedEntities;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[createBatchShortLink]', error);
      throw new InternalServerErrorException(error, '批量新增失败');
    } finally {
      await queryRunner.release();
    }
  }
  async update(
    uuid: string,
    data: UpdateSafeShortLinkDto,
    updatedBy?: string,
  ): Promise<ShortLink> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await queryRunner.manager.findOne(ShortLink, {
        where: { uuid },
      });
      if (!existing) {
        throw new NotFoundException(`短链接 ${uuid} 不存在`);
      }
      const updated = this.shortLinkRepository.merge(existing, data, {
        updatedTime: new Date(),
        updatedBy,
      });
      const saved = await queryRunner.manager.save(ShortLink, updated);

      await queryRunner.commitTransaction();
      return saved;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[updateShortLink]', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error, '更新失败');
    } finally {
      await queryRunner.release();
    }
  }

  // 批量更新（根据 uuid 批量修改）
  async updateBatch(
    datas: BatchUpdateSafeShortLinkDto,
    updatedBy?: string,
  ): Promise<ShortLink[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedEntities = [];
      for (const shortLink of datas.items) {
        const existing = await queryRunner.manager.findOne(ShortLink, {
          where: { uuid: shortLink.uuid },
        });
        if (!existing) {
          throw new NotFoundException(`短链接 ${shortLink.uuid} 不存在`);
        }
        const updated = this.shortLinkRepository.merge(existing, shortLink, {
          updatedTime: new Date(),
          updatedBy,
        });
        const saved = await queryRunner.manager.save(ShortLink, updated);
        updatedEntities.push(saved);
      }
      await queryRunner.commitTransaction();
      return updatedEntities;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[updateBatchShortLink]', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error, '批量更新失败');
    } finally {
      await queryRunner.release();
    }
  }
  async findList(query: QuerySafeShortUrlsDto) {
    const qb = this.shortLinkRepository
      .createQueryBuilder('url')
      .leftJoinAndSelect('url.originalLink', 'originalLink');

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
      if (query.deleted === DeletedStatus.NotDeleted) {
        qb.andWhere('(url.deleted = 0 OR url.deleted IS NULL)');
      } else if (query.deleted === DeletedStatus.Deleted) {
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
      if (query.deleted === DeletedStatus.NotDeleted) {
        qb.andWhere('(url.deleted = 0 OR url.deleted IS NULL)');
      } else if (query.deleted === DeletedStatus.Deleted) {
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

  async remove(uuid: string, updatedBy?: string): Promise<number | undefined> {
    const result = await this.shortLinkRepository.update(uuid, {
      deleted: 1,
      updatedBy,
      updatedTime: new Date(),
    });
    return result.affected;
  }
  async undoRemove(
    uuid: string,
    updatedBy?: string,
  ): Promise<number | undefined> {
    const link = await this.shortLinkRepository.findOneBy({ uuid });
    if (!link || link.deleted !== 1) {
      throw new NotFoundException('记录不存在或未被删除');
    }

    const result = await this.shortLinkRepository.update(uuid, {
      deleted: 0,
      updatedTime: new Date(),
      updatedBy,
    });
    return result.affected;
  }
}
