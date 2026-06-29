import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MitraEntity } from "src/database/entities/mitra.entity";
import { CreateMitraDto } from "./dto/create-mitra.dto";
import { UpdateMitraDto } from "./dto/update-mitra.dto";
import { KategoriPenyaluran } from "src/common/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class MitraService {
  constructor(
    @InjectRepository(MitraEntity)
    private readonly mitraRepository: Repository<MitraEntity>,
  ) {}

  async create(dto: CreateMitraDto): Promise<MitraEntity> {
    const existing = await this.mitraRepository.findOne({
      where: { nama: dto.nama },
      select: { id: true },
    });

    if (existing)
      throw new ConflictException('Mitra dengan kontak ini sudah terdaftar.');

    const mitra = this.mitraRepository.create(dto);
    return this.mitraRepository.save(mitra);
  }

  async findAll(
    kategori?: KategoriPenyaluran,
    limit?: number,
    offset?: number,
  ): Promise<{
    items: MitraEntity[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const safeLimit = Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const safeOffset = Math.max(offset ?? 0, 0);

    const qb = this.mitraRepository.createQueryBuilder('mitra');

    if(kategori) {
      qb.where(':kategori = ANY(mitra.kategoriDiterima)', { kategori });
    }

    qb.orderBy('mitra.createdAt', 'DESC')
      .skip(safeOffset)
      .take(safeLimit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      limit: safeLimit,
      offset: safeOffset,
    };
  }

  async findOne(id: string): Promise<MitraEntity> {
    const mitra = await this.mitraRepository.findOne({ where: { id } });
    if (!mitra) throw new NotFoundException('Mitra tidak ditemukan.');
    return mitra;
  }

  async update(id: string, dto: UpdateMitraDto): Promise<MitraEntity> {
    const mitra = await this.mitraRepository.preload({ id, ...dto });
    if (!mitra) throw new NotFoundException('Mitra tidak ditemukan.');
    return this.mitraRepository.save(mitra);
  }

  async remove(id: string): Promise<{ message: string }> {
    const mitra = await this.findOne(id);
    await this.mitraRepository.remove(mitra);
    return { message: 'Mitra berhasil dihapus.' };
  }
}