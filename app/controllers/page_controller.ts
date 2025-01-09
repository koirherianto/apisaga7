import type { HttpContext } from '@adonisjs/core/http'

export default class PageController {
  public async index({ params }: HttpContext) {
    return params
  }
}
