import { Grade } from '../../common/types';

export class BatchListItemDto {
  id!: string;
  grade!: Grade;
  confidence!: number;
  komoditas!: string;
  beratKg!: number;
  estimasiKgTerselamatkan!: number;
  createdAt!: Date;
}
