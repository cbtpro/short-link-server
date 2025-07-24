import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";

/**
 * 创建原始链接
 */
export class CreateOriginalLinkDto {
  @IsUrl()
  originalUrl: string;
}
/**s
 *更新原始链接
 */
export class UpdateOriginalLinkDto {
  @IsString()
  @IsOptional()
  uuid: string;

  @IsUrl()
  @IsOptional()
  originalUrl: string;

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