import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn, DeleteDateColumn } from 'typeorm';

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
  @Column({ name: 'updated_by' })
  updatedBy: string;
  @Column({ name: 'updated_time' })
  updatedTime: Date;
  @Column({ default: 1 })
  enabled: number;
  deleted: number;
  // @DeleteDateColumn()
  // deletedAt?: Date;
}