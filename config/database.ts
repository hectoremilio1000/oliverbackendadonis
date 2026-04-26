import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const useSqlite = env.get('NODE_ENV') === 'development' && !env.get('DATABASE_URL')

const dbConfig = defineConfig({
  connection: useSqlite ? 'sqlite' : 'postgres',

  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: { filename: app.tmpPath('db.sqlite3') },
      useNullAsDefault: true,
      migrations: { naturalSort: true, paths: ['database/migrations'] },
      schemaGeneration: { enabled: true, rulesPaths: ['./database/schema_rules.js'] },
    },

    postgres: {
      client: 'pg',
      connection: env.get('DATABASE_URL')
        ? {
            connectionString: env.get('DATABASE_URL'),
            ssl: env.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          }
        : {
            host: env.get('DB_HOST', 'localhost'),
            port: Number(env.get('DB_PORT', 5432)),
            user: env.get('DB_USER', 'postgres'),
            password: env.get('DB_PASSWORD', ''),
            database: env.get('DB_DATABASE', 'oliver'),
          },
      migrations: { naturalSort: true, paths: ['database/migrations'] },
      schemaGeneration: { enabled: true, rulesPaths: ['./database/schema_rules.js'] },
      debug: env.get('NODE_ENV') === 'development',
    },
  },
})

export default dbConfig
