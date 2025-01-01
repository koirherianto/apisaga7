import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Project from './project.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = crypto.randomUUID()
  }

  @manyToMany(() => Project, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: true,
    },
  })
  declare projects: ManyToMany<typeof Project>
}
