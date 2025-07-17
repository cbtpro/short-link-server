
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortLink } from './short_link.entity';

@Injectable()
export class ShortLinkService {
  constructor(
    @InjectRepository(ShortLink)
    private shortLinkRepository: Repository<ShortLink>,
  ) { }

  findAll(): Promise<ShortLink[]> {
    return this.shortLinkRepository.find();
  }

  findOne(uuid: string): Promise<ShortLink | null> {
    return this.shortLinkRepository.findOneBy({ uuid });
  }

  async remove(uuid: string): Promise<void> {
    await this.shortLinkRepository.delete(uuid);
  }
}
