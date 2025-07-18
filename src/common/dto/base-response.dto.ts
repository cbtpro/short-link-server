import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({ example: 0, description: '状态码：0 表示成功，-1 表示失败' })
  code: number;

  @ApiProperty({ example: '操作成功', description: '提示信息' })
  message: string;

  @ApiProperty({ example: null, description: '错误信息，失败时返回' })
  error: string | null;

  @ApiProperty({ description: '具体响应数据', nullable: true })
  data: T | null;
}
