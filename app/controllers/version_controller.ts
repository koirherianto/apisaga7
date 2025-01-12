import { createVersionValidator } from '#validators/version'
import type { HttpContext } from '@adonisjs/core/http'

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

  async create({ auth, params, request, response, session }: HttpContext) {
    const { name, slug, is_default } = await request.validateUsing(createVersionValidator)
    const currentUser = auth.user!

    // dapatkan data version dari project
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('slug', params.sProject)
      .firstOrFail()

    // apakah user ini memiliki nama version yang sama
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
}
