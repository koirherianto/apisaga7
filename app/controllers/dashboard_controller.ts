import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import Version from '#models/version'
import Topbar from '#models/topbar'
import Page from '#models/page'
import Project from '#models/project'

export default class DashboardController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    const projects = await auth.user?.related('projects').query()
    return view.render('dashboard/index', { projects })
  }

  /**
   * Display form to create a new record
   */
  async create({ view, auth }: HttpContext) {
    const projects = await auth.user?.related('projects').query()
    return view.render('dashboard/create', { projects })
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
      session.flash('notification', {
        type: 'success',
        message: 'Project created successfully',
      })
    } catch (error) {
      await trx.rollback()
      session.flash('notification', {
        type: 'error',
        message: 'Something went wrong, please try again',
      })
    }
    return response.redirect().toRoute('dashboard.index')
  }

  /**
   * Show individual record
   */
  async show({ view, auth, params }: HttpContext) {
    const currenUser = auth.user!

    const currentProject = await currenUser
      .related('projects')
      .query()
      .where('slug', params.id)
      .firstOrFail()
    const currentVersion = await currentProject
      .related('versions')
      .query()
      .where('isDefault', true)
      .firstOrFail()

    const currentTopbar = await currentVersion
      .related('topbars')
      .query()
      .where('isDefault', true)
      .firstOrFail()

    const currentPage = await currentTopbar
      .related('pages')
      .query()
      .where('isDefault', true)
      .firstOrFail()

    const projects = await currenUser.related('projects').query()

    return view.render('dashboard/show', {
      currentProject,
      projects,
      currentVersion,
      currentTopbar,
      currentPage,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ view, auth, params }: HttpContext) {
    const currenUser = auth.user!
    const currentProject = await currenUser
      .related('projects')
      .query()
      .where('slug', params.id)
      .firstOrFail()

    const projects = await auth.user?.related('projects').query()

    return view.render('dashboard/edit', { currentProject, projects })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response, session }: HttpContext) {
    const currentUser = auth.user!
    const validate = await request.validateUsing(updateProjectValidator, {
      meta: { userId: currentUser.id },
    })

    const isProjectExist = await Project.query().where('slug', validate.slug).first()

    if (isProjectExist) {
      const projectPunyaUser = await auth.user
        ?.related('projects')
        .query()
        .where('slug', validate.slug)
        .first()

      // jika project yang diupdate adalah project yang dimiliki oleh orang lain
      if (!projectPunyaUser) {
        return response.redirect().toRoute('dashboard.index')
      }
    }

    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('slug', params.id)
      .firstOrFail()

    currentProject
      .merge({
        title: validate.title,
        slug: validate.slug,
        visibility: validate.visibility,
        description: validate.description,
      })
      .save()

    session.flash('notification', {
      type: 'success',
      message: 'Project updated successfully',
    })

    return response.redirect().toRoute('dashboard.show', { id: currentProject.slug })
  }

  /**
   * Delete record
   */
  async destroy({ params, auth, response, session }: HttpContext) {
    const user = auth.user!
    const project = await user.related('projects').query().where('slug', params.id).firstOrFail()

    await project.delete()

    session.flash('notification', {
      type: 'success',
      message: 'Project deleted successfully',
    })

    return response.redirect().toRoute('dashboard.index')
  }
}
