import { Exclude } from 'class-transformer';
import { Column, PrimaryColumn } from 'typeorm';
import { EnabledStatus } from '@/common/constants';

export abstract class BaseEntity {
  @PrimaryColumn('bigint')
  uuid: string;

  @Exclude()
  @Column({ default: 0 })
  revision: number;
  @Column({ name: 'created_by' })
  createdBy: string;
  @Column({ name: 'created_time' })
  createdTime: Date;
  @Column({ name: 'updated_by', default: null, nullable: true })
  updatedBy: string;
  @Column({ name: 'updated_time', default: null, nullable: true })
  updatedTime: Date;
  @Column({ type: 'int', nullable: false, default: EnabledStatus.Enabled })
  enabled: number;
  @Column({ type: 'int', nullable: true, default: null })
  deleted: number | null;
  // @DeleteDateColumn()
  // deletedAt?: Date;
}
