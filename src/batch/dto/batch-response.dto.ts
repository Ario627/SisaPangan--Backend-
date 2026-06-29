import { Grade } from '../../common/types';
import { MitraRekomendasiDto } from './mitra-rekomendasi.dto';

export class BatchResponseDto {
  id!: string;
  grade!: Grade;
  confidence!: number;
  komoditas!: string;
  beratKg!: number;
  rekomendasi!: MitraRekomendasiDto[];
  estimasiKgTerselamatkan!: number;
  jarakTersedia!: boolean;
  peringatan?: string;
  createdAt!: Date;
}
