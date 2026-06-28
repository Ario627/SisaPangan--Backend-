import { Injectable, Logger } from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule"
import {ConfigService} from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {promises as fs} from "fs";
import { join, resolve } from "path";
import { BatchEntity } from "src/database/entities/batch.entity";

const ORPHAN_FILE_MAX_AGE_HOURS = 24;
const MILLISECONDS_PER_HOUR = 3_600_000;

@Injectable()
export class FileCleanupCron {
  private readonly logger = new Logger(FileCleanupCron.name);
  private readonly uploadsPath: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
  ) {
    this.uploadsPath =
      this.configService.get<string>('UPLOADS_PATH') ?? './uploads/batches';
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleFileCleanup(): Promise<void> {
    const uploadsDir = resolve(this.uploadsPath);
    const maxAgeMs = ORPHAN_FILE_MAX_AGE_HOURS * MILLISECONDS_PER_HOUR;
    const now = Date.now();

    let files: string[];
    try {
      files = await fs.readdir(uploadsDir);
    } catch (error) {
      this.logger.warn(`Uploads directory not accessible: ${(error as Error).message}`);
      return;
    }

    const referencedPaths = await this.getReferencedFotoPaths();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = join(uploadsDir, file);
      try {
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > maxAgeMs && !referencedPaths.has(filePath)) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      } catch {
        // skip
      }
    }

    if (deletedCount > 0) {
      this.logger.log(`Cleaned up ${deletedCount} orphan file(s) older than ${ORPHAN_FILE_MAX_AGE_HOURS}h`);
    }
  }

  private async getReferencedFotoPaths(): Promise<Set<string>> {
    const batches = await this.batchRepository.find({
      select: { fotoPath: true },
    });
    return new Set(batches.map((b) => resolve(b.fotoPath)));
  }
}