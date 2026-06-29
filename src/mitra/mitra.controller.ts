import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MitraService } from './mitra.service';
import { CreateMitraDto } from './dto/create-mitra.dto';
import { UpdateMitraDto } from './dto/update-mitra.dto';
import { KategoriPenyaluran } from 'src/common/types';

class MitraQueryDto {
  @IsOptional()
  @IsEnum(KategoriPenyaluran)
  kategori?: KategoriPenyaluran;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
} 


@Controller('mitra')
export class MitraController {
    constructor(private readonly mitraService: MitraService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateMitraDto) {
        return this.mitraService.create(dto);
    }

  @Get()
  async findAll(@Query() query: MitraQueryDto) {
    return this.mitraService.findAll(query.kategori, query.limit, query.offset);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mitraService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMitraDto) {
    return this.mitraService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mitraService.remove(id);
  }

}