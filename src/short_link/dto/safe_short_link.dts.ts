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
export class CreateSafeShortLinkDto extends BaseDto {
  @IsUrl()
  shortCode: string;
}
/**s
 *更新原始链接
 */
export class UpdateSafeShortLinkDto extends BaseDto {
  @IsUrl()
  @IsOptional()
  shortCode: string;
}
/**
 * 批量创建原始链接
 */
export class BatchCreateSafeShortLinkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSafeShortLinkDto)
  items: CreateSafeShortLinkDto[];
}

/**
 * 批量更新原始链接
 */
export class BatchUpdateSafeShortLinkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSafeShortLinkDto)
  items: UpdateSafeShortLinkDto[];
}