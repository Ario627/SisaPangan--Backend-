import { Injectable, Logger, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable, tap } from "rxjs";

const sanitizeUrl = (url: string): string =>
  url.replace(/[\n\r]/g, (char) => (char === '\n' ? '\\n' : '\\r'));

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = sanitizeUrl(request.url);
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const responseTime = Date.now() - startTime;
          this.logger.log(`${method} ${url} ${statusCode} ${responseTime}ms`);
        },
        error: (err) => {
          const responseTime = Date.now() - startTime;
          const status = err?.status ?? 500;
          this.logger.error(`${method} ${url} ${status} ${responseTime}ms`);
        },
      }),
    );
  }
}