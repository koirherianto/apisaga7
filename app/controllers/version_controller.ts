import { createVersionValidator } from '#validators/version'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class VersionController {
  async index({ view, auth, params }: HttpContext) {
    const currentUser = auth.user!
    // dapatkan data version dari project
    const project = await currentUser
      .related('projects')
      .query()
      .where('slug', params.sProject)
      .firstOrFail()

    const version = project.related('versions').query().where('slug', params.sVersion).first()
  }

  async create({}: HttpContext) {
    return 'create version'
  }

  // store
  async store({ auth, params, request, response, session }: HttpContext) {
    let data
    try {
      data = await request.validateUsing(createVersionValidator)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).send({
          message: 'Validation failed',
          errors: this.formatValidationErrors(error.messages),
        })
      }
      return response.badRequest({
        message: 'Validation failed',
        errors: this.formatValidationErrors(error.messages),
      })
    }

    const currentUser = auth.user!

    // dapatkan data version dari project.
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('slug', params.sProject)
      .firstOrFail()

    // apakah user ini memiliki nama version yang sama.
    const isVersionExist = await currentProject
      .related('versions')
      .query()
      .where('slug', slug)
      .first()

    if (isVersionExist) {
      session.flash('notification', {
        type: 'error',
        message: 'Version already exist',
      })
      return response.redirect().back()
    }

    await currentProject.related('versions').create({
      name,
      slug,
      isDefault: is_default,
    })

    return response.redirect().toRoute('editor.index')
  }

  async delete() {
    return 'delete version'
  }

  formatValidationErrors(messages) {
    if (!Array.isArray(messages)) {
      return {}
    }

    return messages.reduce((acc, err) => {
      acc[err.field] = err.message
      return acc
    }, {})
  }
}
