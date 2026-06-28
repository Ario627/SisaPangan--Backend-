import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MitraEntity } from "./entities/mitra.entity";
import { BatchEntity } from "./entities/batch.entity";
import { PenyaluranEntity } from "./entities/penyaluran.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MitraEntity, BatchEntity, PenyaluranEntity])
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}