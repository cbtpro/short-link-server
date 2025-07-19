import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Exclude } from 'class-transformer';

@Entity('t_user')
export class User extends BaseEntity {

  @Column({ name: 'real_name' })
  realName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;
}
