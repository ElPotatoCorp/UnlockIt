import { DataSource } from 'typeorm';

export default new DataSource({
  type:       'postgres',
  host:       process.env.DB_HOST          ?? 'localhost',
  port:       parseInt(process.env.DB_PORT ?? '5432'),
  username:   process.env.DB_USER          ?? 'postgres',
  password:   process.env.DB_PASS          ?? '',
  database:   process.env.DB_NAME          ?? 'unlockit',
  entities:   ['src/**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
});