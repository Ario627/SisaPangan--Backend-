import { DataSource } from "typeorm";
import type { Response } from "express";
import { SkipThrottle } from "@nestjs/throttler";
import { Controller, Get, HttpCode, HttpStatus, Res } from "@nestjs/common";

interface HealthResponse {
    status: 'ok' | 'error';
    database: 'connected' | 'disconnected';
}

@Controller('health')
@SkipThrottle()
export class HealthController {
    constructor(private readonly dataSource: DataSource) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async checkHealth(@Res() response: Response): Promise<void> {
        let database: 'connected' | 'disconnected' = 'connected';

        try {
            await this.dataSource.query('SELECT 1');
        } catch{
            database = 'disconnected';
        }

        const body: HealthResponse = {
            status: database === 'connected' ? 'ok' : 'error',
            database,
        }

        const statusCode = database === 'connected' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

        response.status(statusCode).json(body);
    }
}