import 'dotenv/config'; // ⬅️ add this line
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'), // now reads from .env correctly
  },
});
