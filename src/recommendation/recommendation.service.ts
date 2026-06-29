import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MitraEntity } from "src/database/entities/mitra.entity";
import {
  Grade,
  MitraRekomendasiData,
  RecommendationResult,
} from '../common/types';
import {
  GRADE_ESTIMASI_TERSIAPATKAN,
  GRADE_KATEGORI_MAP,
  JARAK_MAX_KM,
  PESAN_GPS_GAGAL,
  SCORING_WEIGHTS_WITH_DISTANCE,
  SCORING_WEIGHTS_WITHOUT_DISTANCE,
  TOP_N_REKOMENDASI,
} from '../common/constants/grade.constant';
import { calculateHaversineDistance } from "src/common/utils/distance.util";

interface ScoredMitra extends MitraRekomendasiData {
  kapasitasKg: number;
}

@Injectable()
export class RecommendationService{
    constructor(
        @InjectRepository(MitraEntity)
        private readonly mitraRepository: Repository<MitraEntity>,
    ) {}

    async getRecommendations(
        grade: Grade,
        beratKg: number,
        operatorLat?: number | null,
        operatorLng?: number | null,
    ): Promise<RecommendationResult> {
        const kategori = GRADE_KATEGORI_MAP[grade];
        const persenTerselamatkan = GRADE_ESTIMASI_TERSIAPATKAN[grade];
        const estimasiKgTerselamatkan = beratKg * persenTerselamatkan;

        const jarakTersedia = 
            operatorLat !== null &&
            operatorLat !== undefined &&
            operatorLng !== null &&
            operatorLng !== undefined;

        const kandidat = await this.mitraRepository
          .createQueryBuilder('mitra')
          .where(':kategori = ANY(mitra.kategoriDiterima)', { kategori })
          .andWhere('mitra.kapasitasKg >= :berat', { berat: beratKg })
          .orderBy('mitra.kapasitasKg', 'DESC')
          .getMany();

        if(kandidat.length === 0) {
            return {
                kategori,
                rekomendasi: [],
                estimasiKgTerselamatkan,
                jarakTersedia,
                peringatan: jarakTersedia ? undefined : PESAN_GPS_GAGAL,
            };
        }

        const bobot = jarakTersedia ? SCORING_WEIGHTS_WITH_DISTANCE : SCORING_WEIGHTS_WITHOUT_DISTANCE;

        const hasil: ScoredMitra[] = [];

        for (const mitra of kandidat) {
            if(mitra.latitude === null || mitra.latitude === undefined || mitra.longitude === null || mitra.longitude === undefined) {
                continue;
            }

            const skorKategori = 1.0;
            const skorKapasitas = Math.min(mitra.kapasitasKg / beratKg, 1.0);

            let jarakKm: number | null = null;
            let skor = 0.0;

            if(jarakTersedia) {
                jarakKm = calculateHaversineDistance(
                    operatorLat!,
                    operatorLng!,
                    mitra.latitude,
                    mitra.longitude
                );

                const skorJarak = Math.max(0, 1 - jarakKm / JARAK_MAX_KM);
                skor =
                    bobot.jarak! * skorJarak +
                    bobot.kapasitas * skorKapasitas +
                    bobot.kategori * skorKategori;
            } else {
                skor = bobot.kapasitas * skorKapasitas + bobot.kategori * skorKategori;
            }

            hasil.push({
                mitraId: mitra.id,
                nama: mitra.nama,
                jenis: mitra.jenis,
                jarakKm,
                skor,
                kontak: mitra.kontak,
                latitude: mitra.latitude,
                longitude: mitra.longitude,
                kapasitasKg: mitra.kapasitasKg,
            });
        }

        hasil.sort((a, b) => {
            if(b.skor !== a.skor) return b.skor - a.skor;
            if(b.kapasitasKg !== a.kapasitasKg) return b.kapasitasKg - a.kapasitasKg;

            return a.nama.localeCompare(b.nama);
        });

        const topN = hasil.slice(0, TOP_N_REKOMENDASI)

        return {
          kategori,
          rekomendasi: topN,
          estimasiKgTerselamatkan,
          jarakTersedia,
          peringatan: jarakTersedia ? undefined : PESAN_GPS_GAGAL,
        };
    }
}