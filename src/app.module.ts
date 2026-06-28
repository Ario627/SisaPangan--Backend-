import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { BatchEntity } from './database/entities/batch.entity';
import { MitraEntity } from './database/entities/mitra.entity';
import { PenyaluranEntity } from './database/entities/penyaluran.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        entities: [MitraEntity, BatchEntity, PenyaluranEntity],
        extra: {
          poolSize: 10,
          statement_timeout: 10000
        }
      }),
    }),

    ScheduleModule.forRoot(),

    DatabaseModule,
  ],
})
export class AppModule {}
