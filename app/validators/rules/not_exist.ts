import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { FieldContext } from '@vinejs/vine/types'
import User from '#models/user'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
  message?: string
  ignoreCurrentUser?: boolean
}

/**
 * Implementation
 */
async function notExist(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  // cek apakah ada data yang sama di database
  const row = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (row) {
    // jika true, maka data yang sama sudah ada di database
    if (options.ignoreCurrentUser === true) {
      //jika ada data yang sama, cek apakah data yang sama adalah data user yang sedang login
      const currentUser = await User.find(field.meta.userId)
      if (currentUser && currentUser[options.column] === row[options.column]) {
        // jika data yang sama adalah data user yang sedang login, maka tidak perlu melakukan validasi
      } else {
        field.report(options.message || 'The {{ field }} field is not unique', 'unique', field)
      }
    } else {
      field.report(options.message || 'The {{ field }} field is not unique', 'unique', field)
    }
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const notExistRule = vine.createRule(notExist)
