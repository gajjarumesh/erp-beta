import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as entities from './entities';

export const getDatabaseConfig = (configService: ConfigService): DataSourceOptions => {
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    entities: Object.values(entities),
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: false,
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
};

// For TypeORM CLI
const configService = {
  get: (key: string) => process.env[key],
};

export default new DataSource(getDatabaseConfig(configService as ConfigService));
