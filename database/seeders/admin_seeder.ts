import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import env from '#start/env'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL') || 'admin@oliver.com'
    const password = env.get('ADMIN_PASSWORD') || 'cambiame123'
    const fullName = env.get('ADMIN_FULL_NAME') || 'Admin Oliver'

    const existing = await User.findBy('email', email)
    if (existing) {
      console.log(`[seed] Usuario ${email} ya existe (id=${existing.id})`)
      return
    }

    const user = await User.create({
      email,
      password,
      fullName,
      role: 'admin' as any,
      isActive: true,
    } as any)
    console.log(`[seed] Admin creado: ${user.email} (id=${user.id})`)
  }
}
