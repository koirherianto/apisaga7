import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { createProjectValidator } from '#validators/project'
import Version from '#models/version'
import Topbar from '#models/topbar'
import { dd } from '@adonisjs/core/services/dumper'
import Page from '#models/page'

export default class DashboardController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('dashboard/index')
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('dashboard/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(createProjectValidator)
    const trx = await db.transaction()

    try {
      const user = auth.user!
      user.useTransaction(trx)

      const project = await user.related('projects').create(data)
      project.useTransaction(trx)

      const version = await Version.create(
        {
          projectId: project.id,
          name: '1',
          isDefault: true,
          visibility: 'public',
        },
        { client: trx }
      )

      const topBar = await Topbar.create(
        {
          versionId: version.id,
          name: 'docs',
          slug: 'i',
          isDefault: true,
        },
        { client: trx }
      )

      await Page.create(
        {
          topbarId: topBar.id,
          name: 'Introduction',
          order: 1,
          isDefault: true,
          title: 'Markdown Example',
          content: '# Markdown Example',
        },
        { client: trx }
      )

      await Page.create(
        {
          topbarId: topBar.id,
          name: 'A Story',
          order: 1,
          isDefault: true,
          title: 'How APISaga Made Documentation Effortless',
          content: '# How APISaga Made Documentation Effortless',
        },
        { client: trx }
      )

      await trx.commit()
      session.flash({ notification: 'Profile updated successfully' })
    } catch (error) {
      await trx.rollback()
      dd(error)
    }
    return response.redirect().toRoute('dashboard.index')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
