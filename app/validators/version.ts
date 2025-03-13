import vine from '@vinejs/vine'
import { existRule } from './rules/exist.js'

export const createVersionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    slug: vine.string().trim().minLength(1).maxLength(100).alpha({
      allowSpaces: false,
      allowUnderscores: false,
      allowDashes: true,
    }),
    is_default: vine.boolean(),
    current_project_id: vine.string(),
    current_version_id: vine
      .string()
      .trim()
      .uuid({ version: [4] })
      .use(existRule({ table: 'versions', column: 'id' })),
    duplicate_version_id: vine
      .string()
      .trim()
      .uuid({ version: [4] })
      .use(existRule({ table: 'versions', column: 'id' })),
  })
)

export const updateVersionValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine
        .string()
        .trim()
        .uuid({ version: [4] })
        .use(existRule({ table: 'versions', column: 'id' })),
    }),
    name: vine.string().trim().minLength(1).maxLength(100),
    slug: vine.string().trim().minLength(1).maxLength(100).alpha({
      allowSpaces: false,
      allowUnderscores: false,
      allowDashes: true,
    }),
    project_id: vine
      .string()
      .trim()
      .uuid({ version: [4] })
      .use(existRule({ table: 'projects', column: 'id' })),
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

export const reorderVersionValidator = vine.compile(
  vine.object({
    project_id: vine
      .string()
      .trim()
      .uuid({ version: [4] })
      .use(existRule({ table: 'projects', column: 'id' })),
    versions: vine
      .array(
        vine
          .string()
          .trim()
          .uuid({ version: [4] })
          .use(existRule({ table: 'versions', column: 'id' }))
      )
      .minLength(2),
  })
)
