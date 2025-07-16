
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OriginalLink } from './original_link.entity';

@Injectable()
export class OriginalLinkService {
  constructor(
    @InjectRepository(OriginalLink)
    private originalLinkRepository: Repository<OriginalLink>,
  ) { }

  findAll(): Promise<OriginalLink[]> {
    return this.originalLinkRepository.find();
  }

  findOne(uuid: number): Promise<OriginalLink | null> {
    return this.originalLinkRepository.findOneBy({ uuid });
  }

  async remove(uuid: number): Promise<void> {
    await this.originalLinkRepository.delete(uuid);
  }
}
