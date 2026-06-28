import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JenisMitra, KategoriPenyaluran } from "src/common/types";

@Entity('mitra')
export class MitraEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  nama!: string;

  @Column({ type: 'enum', enum: JenisMitra })
  jenis!: JenisMitra;

  @Column({ type: 'enum', enum: KategoriPenyaluran, array: true })
  kategoriDiterima!: KategoriPenyaluran[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  kapasitasKg!: number;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ type: 'varchar', length: 255 })
  kontak!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}