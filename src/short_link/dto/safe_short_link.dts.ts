import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

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
  @ValidateIf((o: CreateSafeShortLinkDto) => {
    return (
      o.shortCode !== undefined &&
      o.shortCode !== null &&
      o.shortCode.trim() !== ''
    );
  })
  @IsString()
  @Length(1, 200, { message: 'shortCode 长度必须在 1 到 200 个字符之间' })
  shortCode: string;

  @IsString()
  originalLinkId: string;
}
/**s
 *更新原始链接
 */
export class UpdateSafeShortLinkDto extends BaseDto {
  @ValidateIf(
    (o: UpdateSafeShortLinkDto) =>
      o.shortCode !== undefined && o.shortCode !== null,
  )
  @IsString()
  @Length(1, 200, { message: 'shortCode 长度必须在 1 到 200 个字符之间' })
  shortCode: string;
  @IsString()
  originalLinkId: string;
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
