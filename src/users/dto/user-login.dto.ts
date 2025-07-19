import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

@Exclude()
export class UserLoginDto {

  @Expose()
  @IsNotEmpty({ message: '姓名不能为空' })
  realName: string;

  @Expose()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;


  @Expose()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @Expose()
  @IsOptional()
  email: string;
}
