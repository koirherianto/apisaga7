import vine from '@vinejs/vine'
import { notExistRule } from './rules/not_exist.js'

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
