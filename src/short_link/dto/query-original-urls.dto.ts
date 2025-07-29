import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { IsOptional, IsString, IsEnum, IsDate, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DeletedStatus } from '@/common/constants';


function MultiFormatDateArray() {
  return Transform(({ value }) => {
    if (!value) {
      return [];
    }
    // 如果是已经是数组
    if (Array.isArray(value)) {
      return value.map(v => new Date(v));
    }

    // 如果是以逗号分隔的字符串
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(v => new Date(v));
    }

    // 单个字符串情况
    return [new Date(value)];
  });
}

enum EnabledStatus {
  ENABLED = 1,
  DISABLED = 0,
}

export class QuerySafeShortUrlsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string; // 关键词模糊查（url / 描述）

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsEnum(EnabledStatus)
  enabled?: EnabledStatus;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsEnum(DeletedStatus)
  deleted?: DeletedStatus;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @MultiFormatDateArray()
  @IsDate({ each: true })
  createdTime?: Date[];

  @IsOptional()
  @MultiFormatDateArray()
  @IsDate({ each: true })
  updatedTime?: Date[];
}
