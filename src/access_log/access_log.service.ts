
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from './access_log.entity';

@Injectable()
export class AccessLogService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) { }

  findAll(): Promise<AccessLog[]> {
    return this.accessLogRepository.find();
  }

  findOne(uuid: number): Promise<AccessLog | null> {
    return this.accessLogRepository.findOneBy({ uuid });
  }

  async remove(uuid: number): Promise<void> {
    await this.accessLogRepository.delete(uuid);
  }
}
