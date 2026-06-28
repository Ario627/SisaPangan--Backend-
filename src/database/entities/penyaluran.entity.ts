import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { KategoriPenyaluran } from '../../common/types';
import { BatchEntity } from './batch.entity';
import { MitraEntity } from './mitra.entity';

@Entity('penyaluran')
export class PenyaluranEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: KategoriPenyaluran })
  kategori!: KategoriPenyaluran;

  @Column({ type: 'float', nullable: true })
  jarakKm!: number | null;

  @Column({ type: 'float' })
  skor!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => BatchEntity, (batch) => batch.penyalurans, {
    onDelete: 'CASCADE',
  })
  batch!: BatchEntity;

  @Column({ type: 'uuid' })
  batchId!: string;

  @ManyToOne(() => MitraEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  mitra!: MitraEntity | null;

  @Column({ type: 'uuid', nullable: true })
  mitraId!: string | null;
}
