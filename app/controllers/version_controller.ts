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
}
