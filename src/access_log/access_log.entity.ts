import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('t_access_log')
export class AccessLog extends BaseEntity {
  @Column({ name: 'short_link_id' })
  shortLinkId: string;

  @Column({ name: 'accessed_at' })
  accessedAt: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'is_allowed', default: 0 })
  ifAllowed: number;

  @Column({ name: 'reason' })
  reason: Date;

}