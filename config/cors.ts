import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

const allowedOrigins = (env.get('CORS_ORIGIN') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const corsConfig = defineConfig({
  enabled: true,
  origin: (requestOrigin) => {
    if (!requestOrigin) return true
    if (allowedOrigins.length === 0) return true // permisivo si no hay whitelist
    return allowedOrigins.includes(requestOrigin)
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  headers: true,
  exposeHeaders: [],
  credentials: false,
  maxAge: 90,
})

export default corsConfig
