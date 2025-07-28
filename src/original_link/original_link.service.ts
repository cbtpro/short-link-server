
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OriginalLink } from './original_link.entity';
import { QueryOriginalUrlsDto } from './dto/query-original-urls.dto';
import { BatchCreateOriginalLinkDto, BatchUpdateOriginalLinkDto, CreateOriginalLinkDto, UpdateOriginalLinkDto } from './dto/original_link.dts';
import { SnowflakeService } from '@/common/snowflake/snowflake.service';
import { OrderType } from '@/common/dto/pagination-query.dto';

@Injectable()
export class OriginalLinkService {
  constructor(
    @InjectRepository(OriginalLink)
    private originalLinkRepository: Repository<OriginalLink>,
    private dataSource: DataSource,
    private readonly snowflakeService: SnowflakeService,
  ) { }


  /**
   * 单条新增原始链接记录
   * @param data - 创建原始链接所需的数据，类型为 CreateOriginalLinkDto
   * @returns 新增成功后的原始链接记录，类型为 OriginalLink
   */
  async create(data: CreateOriginalLinkDto, createdBy: string): Promise<OriginalLink> {
    // 创建一个查询运行器，用于管理数据库事务
    const queryRunner = this.dataSource.createQueryRunner();

    // 连接到数据库
    await queryRunner.connect();
    // 开始一个数据库事务
    await queryRunner.startTransaction();

    try {
      // 使用传入的数据创建一个新的原始链接实体，同时生成 UUID、设置创建时间和启用状态
      const originalLink = this.originalLinkRepository.create({
        ...data,
        uuid: this.snowflakeService.generateId(),
        createdTime: new Date(),
        createdBy,
        enabled: 1,
      });

      // 使用查询运行器的管理器保存新创建的原始链接实体
      const newOriginalLink = await queryRunner.manager.save(OriginalLink, originalLink);

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

  // 批量新增
  async createBatch(datas: BatchCreateOriginalLinkDto, createdBy: string): Promise<OriginalLink[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entities = datas.items.map((data) =>
        this.originalLinkRepository.create({
          ...data,
          uuid: this.snowflakeService.generateId(),
          createdBy,
          createdTime: new Date(),
          enabled: 1,
        }),
      );

      const savedEntities = [];
      for (const entity of entities) {
        const saved = await queryRunner.manager.save(OriginalLink, entity);
        savedEntities.push(saved);
      }

      await queryRunner.commitTransaction();
      return savedEntities;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[createBatchOriginalLink]', error);
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('批量新增失败，存在重复短链接');
      }
      throw new InternalServerErrorException('批量新增失败');
    } finally {
      await queryRunner.release();
    }
  }

  // 单条更新
  async update(uuid: string, data: UpdateOriginalLinkDto, updatedBy: string): Promise<OriginalLink> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await queryRunner.manager.findOne(OriginalLink, { where: { uuid } });
      if (!existing) {
        throw new NotFoundException(`短链接 ${uuid} 不存在`);
      }
      const updated = this.originalLinkRepository.merge(existing, data, {
        updatedTime: new Date(),
        updatedBy,
      });
      const saved = await queryRunner.manager.save(OriginalLink, updated);

      await queryRunner.commitTransaction();
      return saved;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[updateOriginalLink]', error);
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('更新失败，存在重复短链接');
      }
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('更新失败');
    } finally {
      await queryRunner.release();
    }
  }

  // 批量更新（根据 uuid 批量修改）
  async updateBatch(datas: BatchUpdateOriginalLinkDto, updatedBy: string): Promise<OriginalLink[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedEntities = [];
      for (const originalLink of datas.items) {
        const existing = await queryRunner.manager.findOne(OriginalLink, { where: { uuid: originalLink.uuid } });
        if (!existing) {
          throw new NotFoundException(`短链接 ${originalLink.uuid} 不存在`);
        }
        const updated = this.originalLinkRepository.merge(existing, originalLink, {
          updatedTime: new Date(),
          updatedBy,
        });
        const saved = await queryRunner.manager.save(OriginalLink, updated);
        updatedEntities.push(saved);
      }
      await queryRunner.commitTransaction();
      return updatedEntities;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('[updateBatchOriginalLink]', error);
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('批量更新失败，存在重复短链接');
      }
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('批量更新失败');
    } finally {
      await queryRunner.release();
    }
  }
  async findAll(query: QueryOriginalUrlsDto) {
    const qb = this.originalLinkRepository.createQueryBuilder('url');

    // 关键词模糊查询
    if (query.keyword) {
      qb.andWhere('url.original_url LIKE :keyword', {
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
        const field = sortItem.field.startsWith('url.') ? sortItem.field : `url.${sortItem.field}`;
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


  findOne(uuid: string): Promise<OriginalLink | null> {
    return this.originalLinkRepository.findOneBy({ uuid });
  }

  async remove(uuid: string, updatedBy: string): Promise<number | undefined> {
    const result = await this.originalLinkRepository.update(uuid, {
      deleted: 1,
      updatedBy,
      updatedTime: new Date(),
    });
    return result.affected;
  }
  async undoRemove(uuid: string, updatedBy: string): Promise<number | undefined> {
    const link = await this.originalLinkRepository.findOneBy({ uuid });
    if (!link || link.deleted !== 1) {
      throw new NotFoundException('记录不存在或未被删除');
    }

    const result = await this.originalLinkRepository.update(uuid, {
      deleted: 0,
      updatedTime: new Date(),
      updatedBy,
    });
    return result.affected;
  }
}
