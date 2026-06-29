import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { promises as fs } from "fs";
import { join, resolve } from "path";
import { BatchEntity } from "src/database/entities/batch.entity";
import { PenyaluranEntity } from "src/database/entities/penyaluran.entity";
import { MitraEntity } from "src/database/entities/mitra.entity";
import { CvClientService } from "src/cv-client/cv-client.service";
import { RecommendationService } from "src/recommendation/recommendation.service";
import { UploadBatchDto } from "./dto/upload-batch.dto";
import { BatchResponseDto } from "./dto/batch-response.dto";
import { BatchListItemDto } from "./dto/batch-list-item.dto";
import { MitraRekomendasiDto } from "./dto/mitra-rekomendasi.dto";
import { GRADE_ESTIMASI_TERSIAPATKAN } from "src/common/constants/grade.constant";
import { validateImageMagicBytes } from "src/common/utils/file-validation.util";
import { Grade, KategoriPenyaluran, MitraRekomendasiData } from "src/common/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class BatchService {
    private readonly logger = new Logger(BatchService.name);
    private readonly uploadsPath: string;

    constructor(
        @InjectRepository(BatchEntity)
        private readonly batchRepository: Repository<BatchEntity>,
        @InjectRepository(PenyaluranEntity)
        private readonly penyaluranRepository: Repository<PenyaluranEntity>,
        @InjectRepository(MitraEntity)
        private readonly mitraRepository: Repository<MitraEntity>,
        private readonly cvClientService: CvClientService,
        private readonly recommendationService: RecommendationService,
        private readonly configService: ConfigService,
    ) {
        this.uploadsPath = this.configService.get<string>('UPLOADS_PATH') ?? './uploads/batches';
    }
}