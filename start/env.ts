import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string.optional(),
  APP_KEY: Env.schema.string(),
  APP_URL: Env.schema.string({ format: 'url' }),

  SESSION_DRIVER: Env.schema.enum(["cookie", "database", "memory"] as const),

  // CORS
  CORS_ORIGIN: Env.schema.string.optional(),

  // Database (DATABASE_URL prioritized; individual fields as fallback)
  DATABASE_URL: Env.schema.string.optional(),
  DB_HOST: Env.schema.string.optional(),
  DB_PORT: Env.schema.number.optional(),
  DB_USER: Env.schema.string.optional(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string.optional(),

  // Admin seeder
  ADMIN_EMAIL: Env.schema.string.optional({ format: 'email' }),
  ADMIN_PASSWORD: Env.schema.string.optional(),
  ADMIN_FULL_NAME: Env.schema.string.optional(),
})
