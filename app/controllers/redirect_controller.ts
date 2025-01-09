import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class RedirectsController {
  public async project({ params, view, response }: HttpContext) {
    const project = await Project.findBy('slug', params.sProject)

    if (!project) {
      return view.render('error/404')
    }

    const version = await project.related('versions').query().where('is_default', true).first()

    if (!version) {
      return view.render('error/404')
    }

    const topbar = await version.related('topbars').query().where('is_default', true).first()

    if (!topbar) {
      return view.render('error/404')
    }

    const page = await topbar.related('pages').query().where('is_default', true).first()

    if (!page) {
      return view.render('error/404')
    }

    return response.redirect().toRoute('page.index', {
      sProject: project.slug,
      sVersion: version.name,
      sTopbar: topbar.slug,
      sPage: page.slug,
    })
  }

  public async version({ params, view, response }: HttpContext) {
    const project = await Project.findBy('slug', params.sProject)

    if (!project) {
      return view.render('error/404')
    }

    let version = await project.related('versions').query().where('name', params.sVersion).first()

    if (!version) {
      version = await project.related('versions').query().where('is_default', true).first()
    }

    if (!version) {
      return view.render('error/404')
    }

    const topbar = await version.related('topbars').query().where('is_default', true).first()

    if (!topbar) {
      return view.render('error/404')
    }

    const page = await topbar.related('pages').query().where('is_default', true).first()

    if (!page) {
      return view.render('error/404')
    }

    return response.redirect().toRoute('page.index', {
      sProject: project.slug,
      sVersion: version.name,
      sTopbar: topbar.slug,
      sPage: page.slug,
    })
  }

  public async topbar({ params, view, response }: HttpContext) {
    const project = await Project.findBy('slug', params.sProject)

    if (!project) {
      return view.render('error/404')
    }

    let version = await project.related('versions').query().where('slug', params.sVersion).first()

    if (!version) {
      version = await project.related('versions').query().where('is_default', true).first()
    }

    if (!version) {
      return view.render('error/404')
    }

    let topbar = await version.related('topbars').query().where('slug', params.sTopbar).first()

    if (!topbar) {
      topbar = await version.related('topbars').query().where('is_default', true).first()
    }

    if (!topbar) {
      return view.render('error/404')
    }

    const page = await topbar.related('pages').query().where('is_default', true).first()

    if (!page) {
      return view.render('error/404')
    }

    return response.redirect().toRoute('page.index', {
      sProject: project.slug,
      sVersion: version.name,
      sTopbar: topbar.slug,
      sPage: page.slug,
    })
  }
}
