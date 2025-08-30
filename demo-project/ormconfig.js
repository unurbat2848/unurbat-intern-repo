const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'nestuser',
  password: process.env.DB_PASSWORD || 'nestpass',
  database: process.env.DB_NAME || 'nestdb',
  entities: [path.join(__dirname, 'nestjs/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false, // Disable for migrations
  migrationsRun: false,
});