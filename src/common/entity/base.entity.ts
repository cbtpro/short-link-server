import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryColumn('bigint')
  uuid: number;
  @Column({ default: 0 })
  revision: number;
  @Column({ name: 'created_by' })
  createdBy: string;
  @Column({ name: 'created_time' })
  createdTime: Date;
  @Column({ name: 'updated_by' })
  updateBy: string;
  @Column({ name: 'updated_time' })
  updateTime: Date;
}