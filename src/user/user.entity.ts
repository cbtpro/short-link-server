
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('t_user')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: boolean;
}
