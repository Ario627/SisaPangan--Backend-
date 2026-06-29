import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import { Grade, CvGradeResponse } from 'src/common/types';
import { GRADE_KATEGORI_MAP } from 'src/common/constants/grade.constant';
import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class CvClientService {
  private readonly logger = new Logger(CvClientService.name);
  private readonly cvServiceUrl: string;
  private readonly cvServiceTimeoutMs: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.cvServiceUrl = this.configService.get<string>('CV_SERVICE_URL')!;
    this.cvServiceTimeoutMs = this.configService.get<number>(
      'CV_SERVICE_TIMEOUT_MS',
    )!;
  }

  async forwardPhoto(
    filePath: string,
    komoditas: string,
  ): Promise<CvGradeResponse> {
    const formData = new FormData();
    formData.append('file', createReadStream(filePath));
    formData.append('komoditas', komoditas);

    let response: AxiosResponse<unknown>;

    try {
      const observable = this.httpService.post(
        `${this.cvServiceUrl}/grade`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.cvServiceTimeoutMs,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      );

      response = await firstValueFrom(observable);
    } catch (error) {
      throw this.mapAxiosError(error as AxiosError);
    }

    return this.validateCvResponse(response.data);
  }

  private mapAxiosError(error: AxiosError): Error {
    const code = error.code;
    const status = error.response?.status;

    this.logger.error(
      `CV Service error: code=${code}, status=${status}, message=${error.message}`,
    );

    if (
      code === 'ECONNABORTED' ||
      code === 'ECONNREFUSED' ||
      code === 'ENOTFOUND'
    ) {
      return new ServiceUnavailableException(
        'Layanan grading sedang tidak merespons. Coba beberapa saat lagi.',
      );
    }

    if (status !== undefined && status >= 500) {
      return new ServiceUnavailableException(
        'Layanan grading mengalami gangguan.',
      );
    }

    if (status === 429) {
      return new ServiceUnavailableException(
        'Layanan grading sedang sibuk. Coba beberapa saat lagi.',
      );
    }

    if (status === 401 || status === 403) {
      return new ServiceUnavailableException(
        'Layanan grading mengalami gangguan.',
      );
    }

    if (status !== undefined && status >= 400) {
      return new UnprocessableEntityException(
        'Foto tidak dapat diproses oleh layanan grading.',
      );
    }

    return new ServiceUnavailableException(
      'Layanan grading sedang tidak merespons. Coba beberapa saat lagi.',
    );
  }

  private validateCvResponse(data: unknown): CvGradeResponse {
    const obj = data as Record<string, unknown>;

    if (
      obj === null ||
      obj === undefined ||
      obj.grade === null ||
      obj.grade === undefined ||
      obj.confidence === null ||
      obj.confidence === undefined
    ) {
      throw new BadGatewayException('Respons layanan grading tidak valid.');
    }

    const grade = obj.grade as string;
    if (!Object.keys(GRADE_KATEGORI_MAP).includes(grade)) {
      throw new BadGatewayException('Respons layanan grading tidak valid.');
    }

    const confidence = obj.confidence as number;

    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      throw new BadGatewayException('Respons layanan grading tidak valid.');
    }

    return { grade: grade as Grade, confidence };
  }
}
