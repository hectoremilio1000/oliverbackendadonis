import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { column } from '@adonisjs/lucid/orm'

export type UserRole = 'admin' | 'sales'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column()
  declare role: UserRole

  @column({ columnName: 'is_active', serializeAs: 'is_active' })
  declare isActive: boolean

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  serialize() {
    const json = super.serialize()
    delete (json as any).password
    return {
      id: json.id,
      email: json.email,
      full_name: this.fullName,
      role: this.role,
      is_active: this.isActive,
    }
  }
}
