import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { existRule } from './rules/exist.js'
import { notExistRule } from './rules/not_exist.js'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',
  'confirmed': 'The confirmation does not match',
  // Error message for the username field
  'username.required': 'Please choose a username for your account',
})

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase(),
    email: vine
      .string()
      .trim()
      .email()
      .toLowerCase()
      .use(notExistRule({ table: 'users', column: 'email', message: 'Email already taken' })),
    username: vine
      .string()
      .trim()
      .minLength(4)
      .maxLength(20)
      .toLowerCase()
      .alpha({
        allowSpaces: false,
        allowUnderscores: true,
        allowDashes: true,
      })
      .use(notExistRule({ table: 'users', column: 'username', message: 'Username already taken' })),
    password: vine.string().trim().minLength(6).confirmed(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .use(existRule({ table: 'users', column: 'email', message: 'Email Or Password is wrong' })),
    password: vine.string().trim(),
  })
)

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase().optional(),
    email: vine.string().trim().email().optional(),
    username: vine.string().trim().minLength(4).toLowerCase().optional(),
    password: vine.string().trim().minLength(6).optional(),
  })
)

export const idValidator = vine.number()
