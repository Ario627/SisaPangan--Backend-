import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { JenisMitra, KategoriPenyaluran } from 'src/common/types';

export class CreateMitraDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nama!: string;

  @IsEnum(JenisMitra)
  jenis!: JenisMitra;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(KategoriPenyaluran, { each: true })
  kategoriDiterima!: KategoriPenyaluran[];

  @IsNumber()
  @Min(1)
  @Max(100000)
  @Type(() => Number)
  kapasitasKg!: number;

  @IsNumber()
  @IsLatitude()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude!: number;

  @IsNumber()
  @IsLongitude()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  kontak!: string;
}

