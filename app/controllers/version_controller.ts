import Version from '#models/version'
import { createVersionValidator, deleteVersionValidator } from '#validators/version'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class VersionController {
  async index({}: HttpContext) {
    // const currentUser = auth.user!
    // // dapatkan data version dari project
    // const project = await currentUser
    //   .related('projects')
    //   .query()
    //   .where('slug', params.sProject)
    //   .firstOrFail()
    // const version = project.related('versions').query().where('slug', params.sVersion).first()
  }

  async create({}: HttpContext) {
    return 'create version'
  }
/* eslint-disable prettier/prettier */
  // store
  async store({ auth, request, response }: HttpContext) {

    let validate
    try {
      validate = await request.validateUsing(createVersionValidator)

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).send({
          message: 'Validation failed',
          errors: this.formatErrorMessagestoString(error.messages),
        })
      }
      return response.badRequest({
        message: 'Validation failed',
        errors: this.formatErrorMessagestoString(error.messages),
      })
    }

    const currentUser = auth.user!

    // dapatkan data version dari project.
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('id', validate.project_id)
      .first()


    if (!currentProject) {
      return response.status(404).send({
        message: 'Project not found',
      })
    }

    // apakah user ini memiliki nama version yang sama.
    const isVersionExist = await currentProject
      .related('versions')
      .query()
      .where('slug', validate.slug)
      .first()

    if (isVersionExist) {
      return response.status(409).send({
        message: 'Version already exist',
      })
    }

    const newVersion = await currentProject.related('versions').create({
      name: validate.name,
      slug: validate.slug,
      isDefault: validate.is_default,
    })

    return response.status(201).send({
      message: 'Version created',
      data: newVersion,
    })
  }

  async destroy({auth, request, response}: HttpContext) {

    const currentUser = auth.user!
    console.log(request.all())


    let validate
    try {
      validate = await request.validateUsing(deleteVersionValidator)

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(this.formatErrorMessagestoString(error.messages))
        return response.status(422).send({
          message: 'Validation failed',
          errors: this.formatErrorMessagestoString(error.messages),
        })
      }
      return response.badRequest({
        message: 'Validation failed',
        errors: this.formatErrorMessagestoString(error.messages),
      })
    }



    
    
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('id', validate.project_id)
      .first()

    if (!currentProject) {
      return response.status(404).send({
        message: 'Project not found / you dont have access to this project',
      })
    }

    const currnetVersion = await currentProject.related('versions').query().where('id', validate.params.id).first()

    if (!currnetVersion) {
      return response.status(404).send({
        message: 'Version not found / you dont have access to this version',
      })
    }

    
    await currnetVersion.delete()

    return response.status(200).send({
      message: 'Version deleted',
      data: currnetVersion,
    })

  }

  formatValidationErrors(messages: any) {
    if (!Array.isArray(messages)) {
      return {}
    }

    return messages.reduce((acc, err) => {
      acc[err.field] = err.message
      return acc
    }, {})
  }

  formatErrorMessagestoString(messages: any) {
    if (!Array.isArray(messages)) {
      return ''
    }

    return messages.reduce((acc, err) => {
      acc += `${err.message}\n`
      return acc
    }, '')
  }
}
