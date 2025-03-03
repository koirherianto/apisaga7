import vine from '@vinejs/vine'
import { existRule } from './rules/exist.js'

export const createVersionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).maxLength(100),
    slug: vine.string().trim().minLength(4).maxLength(100).alpha({
      allowSpaces: false,
      allowUnderscores: false,
      allowDashes: true,
    }),
    is_default: vine.boolean(),
    project_id: vine.string(),
  })
)

export const deleteVersionValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine
        .string()
        .trim()
        .uuid({ version: [4] })
        .use(existRule({ table: 'versions', column: 'id' })),
    }),
    project_id: vine
      .string()
      .trim()
      .uuid({ version: [4] })
      .use(existRule({ table: 'projects', column: 'id' })),
  })
)
