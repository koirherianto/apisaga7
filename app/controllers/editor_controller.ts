import type { HttpContext } from '@adonisjs/core/http'

export default class EditorController {
  async index({ auth, inertia, params }: HttpContext) {
    const currentUser = auth.user!
    // dapatkan data version dari project
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('slug', params.sProject)
      .firstOrFail()

    const currentVersion = await currentProject
      .related('versions')
      .query()
      .where('slug', params.sVersion)
      .firstOrFail()

    const currentTopbar = await currentVersion
      .related('topbars')
      .query()
      .where('slug', params.sTopbar)
      .firstOrFail()

    const currentPage = await currentTopbar
      .related('pages')
      .query()
      .where('slug', params.sPage)
      .firstOrFail()

    const versions = await currentProject.related('versions').query()
    const topbars = await currentVersion.related('topbars').query()
    const pages = await currentTopbar.related('pages').query()

    return inertia.render('editor', {
      currentProject,
      currentVersion,
      currentTopbar,
      currentPage,
      versions,
      topbars,
      pages,
    })
  }
}
