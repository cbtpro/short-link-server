import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";

abstract class BaseDto {
  
  @IsString()
  @IsOptional()
  uuid: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  revision?: number;

  @IsOptional()
  @IsDateString()
  createdTime?: Date;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsDateString()
  updatedTime?: Date;

  @IsOptional()
  @IsNumber()
  enabled?: number;

  @IsOptional()
  @IsNumber()
  deleted?: number;
}
/**
 * 创建原始链接
 */
export class CreateOriginalLinkDto extends BaseDto {
  @IsUrl()
  originalUrl: string;
}
/**s
 *更新原始链接
 */
export class UpdateOriginalLinkDto extends BaseDto {
  @IsUrl()
  @IsOptional()
  originalUrl: string;
}
/**
 * 批量创建原始链接
 */
export class BatchCreateOriginalLinkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOriginalLinkDto)
  items: CreateOriginalLinkDto[];
}

/**
 * 批量更新原始链接
 */
export class BatchUpdateOriginalLinkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOriginalLinkDto)
  items: UpdateOriginalLinkDto[];
}