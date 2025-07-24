import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
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
}
