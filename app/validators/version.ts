import vine from '@vinejs/vine'

export const createVersionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).maxLength(100),
    slug: vine.string().trim().minLength(4).maxLength(100).alpha({
      allowSpaces: false,
      allowUnderscores: false,
      allowDashes: true,
    }),
    is_default: vine.boolean(),
  })
)
