import { BadRequestException } from "@nestjs/common";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function validateImageMagicBytes(filePath: string): Promise<void> {
    const {fileTypeFromFile } = await import('file-type');

    const result = await fileTypeFromFile(filePath);

    if(!result || !ALLOWED_MIME_TYPES.includes(result.mime)) {
        throw new BadRequestException(
          'Format file tidak didukung. Hanya JPG/PNG/WebP.',
        );
    }
}