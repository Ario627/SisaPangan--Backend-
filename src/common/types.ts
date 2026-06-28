export enum Grade {
    FRESH = 'fresh',
    ROTTEN = 'rotten',
}

export enum JenisMitra {
    PASAR = 'pasar',
    UMKM = 'umkm',
    KOMPOS = 'kompos',
    PANGAN_LAIN = 'pangan_lain',
}

export enum KategoriPenyaluran{
    JUAL_NORMAL = 'jual_normal',
    KOMPOS_PAKAN = 'kompos_pakan',
}

export interface CvGradeResponse {
    grade: Grade;
    confidence: number;
}

export interface MitraRekomendasiData {
  mitraId: string;
  nama: string;
  jenis: JenisMitra;
  jarakKm: number | null;
  skor: number;
  kontak: string;
  latitude: number;
  longitude: number;
  kapasitasKg: number;
}

export interface RecommendationResult {
    kategori: KategoriPenyaluran;
    rekomendasi: MitraRekomendasiData[];
    estimasiKgTerselamatkan: number;
    jarakTersedia: boolean;
    peringatan?: string;
}