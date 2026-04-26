import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class HealthController {
  async show({ response }: HttpContext) {
    let dbOk = false
    try {
      await db.rawQuery('SELECT 1')
      dbOk = true
    } catch {
      dbOk = false
    }
    return response.ok({ ok: true, db: dbOk, ts: new Date().toISOString() })
  }
}
