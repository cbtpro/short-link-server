import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { ShortLink } from '@/short_link/short_link.entity';

@Entity('t_original_link')
export class OriginalLink extends BaseEntity {
  @Column({ name: 'original_url' })
  originalUrl: string;

  @OneToMany(() => ShortLink, (shortLink: ShortLink) => shortLink.originalLink)
  shortLinks: ShortLink[];
}
