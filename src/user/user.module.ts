
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { AuthService } from '@/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SnowflakeModule } from '@/common/snowflake/snowflake.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    /**
     * 自动添加到配置对象的 models 数组中
     */
    TypeOrmModule.forFeature([User]),
    JwtModule,
    SnowflakeModule,
    AuthModule,
  ],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [AuthService, JwtModule],
})
export class UserModule { }
