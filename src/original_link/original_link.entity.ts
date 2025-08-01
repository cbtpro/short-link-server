import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('t_original_link')
export class OriginalLink extends BaseEntity {
  @Column({ name: 'original_url' })
  originalUrl: string;
}
