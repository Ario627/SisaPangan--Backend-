import { Grade, KategoriPenyaluran, ScoringWeights } from '../types';

export const GRADE_KATEGORI_MAP: Record<Grade, KategoriPenyaluran> = {
  [Grade.FRESH]: KategoriPenyaluran.JUAL_NORMAL,
  [Grade.ROTTEN]: KategoriPenyaluran.KOMPOS_PAKAN,
};

export const GRADE_ESTIMASI_TERSIAPATKAN: Record<Grade, number> = {
  [Grade.FRESH]: 0.95,
  [Grade.ROTTEN]: 0.6,
};

export const JARAK_MAX_KM = 50;

export const SCORING_WEIGHTS_WITH_DISTANCE: ScoringWeights = {
  jarak: 0.5,
  kapasitas: 0.3,
  kategori: 0.2,
};

export const SCORING_WEIGHTS_WITHOUT_DISTANCE: ScoringWeights = {
  kapasitas: 0.6,
  kategori: 0.4,
};

export const TOP_N_REKOMENDASI = 5;

export const PESAN_GPS_GAGAL =
  'Lokasi Anda tidak terdeteksi. Rekomendasi ini diurutkan berdasarkan kapasitas mitra saja, tanpa mempertimbangkan jarak. Pertimbangkan jarak secara manual sebelum mengirim.';

export const PESAN_TIDAK_ADA_MITRA =
  'Tidak ada mitra penerima yang cocok untuk kategori ini saat ini.';