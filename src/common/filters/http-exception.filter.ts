import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const isDev = process.env.NODE_ENV !== 'production';

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message =
          'Terjadi kesalahan internal. Tim teknis sedang memperbaiki.';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status  = exception.getStatus();
            const res = exception.getResponse();
            if(typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null ) {
                const resObj = res as Record<string, any>;
                error = (resObj.error as string) ?? error;
                const msg = resObj.message;

                if (Array.isArray(msg)) {
                    message = `Validasi gagal: ${msg.join(', ')}`;
                } else if (typeof msg === 'string') {
                    message = msg;
                }
            } 
        } else if (exception instanceof Error) {
            this.logger.error(
              `Unexpected error: ${exception.message}`,
              exception.stack,
            )
        }

        const body: Record<string, any> = {
            success: false,
            timestamp: new Date().toISOString(),
            statusCode: status,
            error,
            message 
        }

        if (isDev) {
            body.path = request.url
        }

        if (exception instanceof Error && !(exception instanceof HttpException)) {
            this.logger.error(exception.stack);
        }

        response.status(status).json(body);
    }
}