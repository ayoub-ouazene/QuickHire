// prisma.config.js
const { defineConfig, env } = require('prisma/config');
require('dotenv').config(); // load .env

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',          // path to your Prisma schema
  migrations: { path: 'prisma/migrations' }, // folder for migrations
  datasource: {
    url: env('DATABASE_URL'),              // your DB url from .env
  },
});
