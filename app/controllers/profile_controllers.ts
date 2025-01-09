import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  /**
   * Display a list of resource
   */
  index({ view, auth }: HttpContext) {
    const user = auth.user!
    return view.render('profile/index', { user })
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ request, auth, response, session }: HttpContext) {
    const { name, email, username, password } = await request.validateUsing(
      updateProfileValidator,
      { meta: { userId: auth.user!.id } }
    )

    const user = auth.user!

    if (password) {
      user.merge({ name, email, username, password })
    } else {
      user.merge({ name, email, username })
    }

    user.save()

    session.flash('notification', {
      type: 'success',
      message: 'Profile updated successfully',
    })

    response.redirect().back()
  }
}
