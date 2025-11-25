import 'dotenv/config';
import { defineConfig } from '@prisma/config';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is not set (check your .env or environment vars)');
}

export default defineConfig({
  datasource: {
    url,
  },
});
