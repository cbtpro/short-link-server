import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity('t_user')
export class User extends BaseEntity {

  @IsNotEmpty({ message: '姓名不能为空' })
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
