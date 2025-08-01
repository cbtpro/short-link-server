import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('t_short_link')
export class ShortLink extends BaseEntity {
  @Column({ name: 'original_link_id' })
  originalLinkId: string;

  @Column({ name: 'short_code' })
  shortCode: string;

  @Column({ name: 'custom_params' })
  customParams: string;

  @Column({ name: 'access_password' })
  accessPassword: string;

  @Column({ name: 'case_insensitive', default: 0 })
  caseInsensitive: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'max_visits' })
  maxVisits: number;

  @Column({ name: 'visit_count' })
  visitCount: number;

  @Column({ name: 'ip_whitelist' })
  ipWhitelist: string;

  @Column({ name: 'ip_blacklist' })
  ipBlacklist: string;

  @Column({ name: 'ua_whitelist' })
  uaWhitelist: string;

  @Column({ name: 'ua_blacklist' })
  uaBlacklist: string;

  @Column({ name: 'remark' })
  remark: string;
}
