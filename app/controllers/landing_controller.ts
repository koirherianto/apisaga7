import type { HttpContext } from '@adonisjs/core/http'

export default class LandingController {
  async index({ view, auth }: HttpContext) {
    await auth.check()
    return view.render('landing')
  }
}
