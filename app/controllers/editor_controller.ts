import type { HttpContext } from '@adonisjs/core/http'

export default class EditorController {
  async index({ auth, inertia }: HttpContext) {
    await auth.check()
    return inertia.render('editor')
  }
}
