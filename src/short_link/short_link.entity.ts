import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { OriginalLink } from '@/original_link/original_link.entity';

@Entity('t_short_link')
export class ShortLink extends BaseEntity {
  @Column({ name: 'original_link_id' })
  originalLinkId: string;

  @Column({ name: 'short_code' })
  shortCode: string;

  @Column({ name: 'custom_params', default: null, nullable: true })
  customParams: string;

  @Column({ name: 'access_password', default: null, nullable: true })
  accessPassword: string;

  @Column({ name: 'case_insensitive', default: 0 })
  caseInsensitive: number;

  @Column({ name: 'expires_at', default: null, nullable: true })
  expiresAt: Date;

  @Column({ name: 'max_visits', default: null, nullable: true })
  maxVisits: number;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ name: 'ip_whitelist', default: null, nullable: true })
  ipWhitelist: string;

  @Column({ name: 'ip_blacklist', default: null, nullable: true })
  ipBlacklist: string;

  @Column({ name: 'ua_whitelist', default: null, nullable: true })
  uaWhitelist: string;

  @Column({ name: 'ua_blacklist', default: null, nullable: true })
  uaBlacklist: string;

  @Column({ name: 'remark', default: null, nullable: true })
  remark: string;

  @ManyToOne(
    () => OriginalLink,
    (originalLink: OriginalLink) => originalLink.shortLinks,
  )
  @JoinColumn({ name: 'original_link_id' })
  originalLink: OriginalLink;
}
