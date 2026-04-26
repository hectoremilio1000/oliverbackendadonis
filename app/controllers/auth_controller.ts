import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      if (!user.isActive) {
        return response.unauthorized({ error: 'Usuario desactivado' })
      }
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '30 days' })
      return response.ok({ token: token.value!.release(), user: user.serialize() })
    } catch {
      return response.unauthorized({ error: 'Credenciales inválidas' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
    return response.ok({ ok: true })
  }

  async me({ auth, response }: HttpContext) {
    return response.ok({ user: auth.user!.serialize() })
  }
}
