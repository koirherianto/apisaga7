import vine from '@vinejs/vine'
import { notExistRule } from './rules/not_exist.js'
import { existRule } from './rules/exist.js'

export const createProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(4).maxLength(100),
    slug: vine
      .string()
      .trim()
      .minLength(4)
      .maxLength(100)
      .alpha({
        allowSpaces: false,
        allowUnderscores: false,
        allowDashes: true,
      })
      .use(
        notExistRule({
          table: 'projects',
          column: 'slug',
          message: 'Project already exists',
        })
      ),
    type: vine.enum(['version', 'brance']),
    visibility: vine.enum(['public', 'private']),
    description: vine.string().trim().optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine
        .string()
        .trim()
        .alpha({
          allowSpaces: false,
          allowUnderscores: false,
          allowDashes: true,
        })
        .use(existRule({ table: 'projects', column: 'slug' })),
    }),
    title: vine.string().trim().minLength(4).maxLength(100),
    slug: vine.string().trim().minLength(4).maxLength(100).alpha({
      allowSpaces: false,
      allowUnderscores: false,
      allowDashes: true,
    }),
    visibility: vine.enum(['public', 'private']),
    description: vine.string().trim().optional(),
  })
)
