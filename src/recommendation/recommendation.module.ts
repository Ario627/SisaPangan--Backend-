import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MitraEntity } from "src/database/entities/mitra.entity";
import { RecommendationService } from "./recommendation.service";

@Module({
    imports: [TypeOrmModule.forFeature([MitraEntity])],
    providers: [RecommendationService],
    exports: [RecommendationService],
})
export class RecommendationModule {}