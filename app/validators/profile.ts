import vine from '@vinejs/vine'
import { notExistRule } from './rules/not_exist.js'

export const updateProfileValidator = vine.withMetaData<{ userId: string }>().compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase(),
    email: vine
      .string()
      .trim()
      .email()
      .use(
        notExistRule({
          table: 'users',
          column: 'email',
          ignoreCurrentUser: true,
          message: 'Email already taken',
        })
      ),
    username: vine
      .string()
      .trim()
      .minLength(4)
      .toLowerCase()
      .use(
        notExistRule({
          table: 'users',
          column: 'username',
          ignoreCurrentUser: true,
          message: 'Username already taken',
        })
      ),
    password: vine.string().trim().minLength(6).optional(),
  })
)
