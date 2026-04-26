import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nombre', 200).notNullable()
      table.string('empresa', 200).nullable()
      table.string('email', 254).notNullable()
      table.string('telefono', 50).notNullable()
      table.string('tipo', 100).notNullable()
      table.string('etapa', 100).nullable()
      table.text('mensaje').nullable()
      table.string('status', 20).notNullable().defaultTo('new')
      table.text('notes').nullable()
      table.integer('assigned_to').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.string('ip', 64).nullable()
      table.text('user_agent').nullable()
      table.string('utm_source', 100).nullable()
      table.string('utm_medium', 100).nullable()
      table.string('utm_campaign', 100).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status'])
      table.index(['email'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
