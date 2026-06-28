import { Grade } from "src/common/types";
import { PenyaluranEntity } from "./penyaluran.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('batch')
export class BatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  komoditas!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  beratKg!: number;

  @Column({ type: 'enum', enum: Grade })
  grade!: Grade;

  @Column({ type: 'float' })
  confidence!: number;

  @Column({ type: 'varchar', length: 500 })
  fotoPath!: string;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  uploadLatitude!: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  uploadLongitude!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PenyaluranEntity, (penyaluran) => penyaluran.batch)
  penyalurans!: PenyaluranEntity[];
}