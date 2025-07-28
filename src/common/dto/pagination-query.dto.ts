import { Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, IsString, IsIn, ValidateNested, IsArray } from 'class-validator';

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortItem {
  @IsString()
  field: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(OrderType)
  order: OrderType;
}
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(OrderType)
  order?: OrderType = OrderType.DESC;

  @IsOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortItem)
  sortList?: SortItem[];
}
