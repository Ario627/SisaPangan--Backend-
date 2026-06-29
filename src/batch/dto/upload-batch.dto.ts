import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UploadBatchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  komoditas!: string;

  @IsNumber()
  @Min(0.1)
  @Max(10000)
  @Type(() => Number)
  beratKg!: number;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude?: number;
}