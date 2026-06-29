import { JenisMitra } from "src/common/types";

export class MitraRekomendasiDto {
  mitraId!: string;
  nama!: string;
  jenis!: JenisMitra;
  jarakKm!: number | null;
  skor!: number;
  kontak!: string;
  latitude!: number;
  longitude!: number;
}