import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost'

export default class Lead extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare empresa: string | null

  @column()
  declare email: string

  @column()
  declare telefono: string

  @column()
  declare tipo: string

  @column()
  declare etapa: string | null

  @column()
  declare mensaje: string | null

  @column()
  declare status: LeadStatus

  @column()
  declare notes: string | null

  @column({ columnName: 'assigned_to' })
  declare assignedTo: number | null

  @column()
  declare ip: string | null

  @column({ columnName: 'user_agent' })
  declare userAgent: string | null

  @column({ columnName: 'utm_source' })
  declare utmSource: string | null

  @column({ columnName: 'utm_medium' })
  declare utmMedium: string | null

  @column({ columnName: 'utm_campaign' })
  declare utmCampaign: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'assignedTo' })
  declare assignee: BelongsTo<typeof User>

  serialize() {
    const json = super.serialize()
    return {
      ...json,
      created_at: this.createdAt?.toISO(),
      updated_at: this.updatedAt?.toISO(),
      assigned_to: this.assignedTo,
      user_agent: this.userAgent,
      utm_source: this.utmSource,
      utm_medium: this.utmMedium,
      utm_campaign: this.utmCampaign,
    }
  }
}
