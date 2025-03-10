import Version from '#models/version'
import {
  createVersionValidator,
  updateVersionValidator,
  deleteVersionValidator,
  reorderVersionValidator,
} from '#validators/version'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { dd } from '@adonisjs/core/services/dumper'

export default class VersionController {
  async index({}: HttpContext) {}

  async create({}: HttpContext) {}

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

    // apakah user ini memiliki akses ke project ini.
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('id', validate.project_id)
      .first()

    // jika user tidak memiliki akses ke project ini.
    if (!currentProject) {
      return response.status(404).send({
        message: 'You dont have access to this project',
      })
    }

    // apakah user ini memiliki version ini
    const currentVersion = await currentProject
      .related('versions')
      .query()
      .where('id', validate.current_version_id)
      .first()

    if (!currentVersion) {
      return response.status(404).send({
        message: 'You dont have access to this version',
      })
    }

    // Cek apakah version sudah ada
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

    // Dapatkan urutan version terakhir
    const latestVersion = await Version.query().where('project_id', currentProject.id).orderBy('urutan', 'desc').first()
    await db.transaction(async (trx) => {
      try {
        const currentVersionTrx = await Version.findOrFail(currentVersion.id, { client: trx })

        const diCopyTopbars = await currentVersionTrx!.related('topbars').query().preload('pages')

        const newVersion = await currentProject.related('versions').create({
          name: validate.name,
          slug: validate.slug,
          isDefault: validate.is_default,
          urutan: latestVersion ? latestVersion.urutan + 1 : 0,
        }, { client: trx })

        for (const topbar of diCopyTopbars) {
          const newTopbar = await newVersion.related('topbars').create({
            name: topbar.name,
            slug: topbar.slug,
            isDefault: topbar.isDefault,
          }, { client: trx })
          newTopbar.useTransaction(trx)
          const diCopyPages = await topbar.related('pages').query()

          for (const page of diCopyPages) {
            const newPage = await newTopbar.related('pages').create({
              name: page.name,
              slug: page.name,
              title: page.title,
              isDefault: page.isDefault,
              content: page.content,
              order: page.order,
            },{ client: trx })
            newPage.useTransaction(trx)
          }
        }

        return response.status(201).send({
          message: 'New Version created',
          data: newVersion,
        })
      } catch (error) {
        console.log(error)
        await trx.rollback()
        return response.status(500).send({
          message: 'Internal server error',
          error: error.message,
        })
      }
    }) // end transaction
  }

  async update({auth, request, response}: HttpContext) {
    
    let validate
    try {
      validate = await request.validateUsing(updateVersionValidator)

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

    const currentVersion = await currentProject.related('versions').query().where('id', validate.params.id).first()

    if (!currentVersion) {
      return response.status(404).send({
        message: 'Version not found / you dont have access to this version',
      })
    }

    // check apakah ada slug yang sama
    const isVersionExist = await currentProject
      .related('versions')
      .query()
      .where('slug', validate.slug)
      .whereNot('id', validate.params.id)
      .first()

    if (isVersionExist) {
      return response.status(409).send({
        message: 'Version already exist',
      })
    }

    currentVersion.name = validate.name
    currentVersion.slug = validate.slug

    await currentVersion.save()

    return response.status(200).send({
      message: 'Version updated',
      data: currentVersion,
    })

  }

  async destroy({auth, request, response}: HttpContext) {
    const currentUser = auth.user!

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
    
    // apakah user ini memiliki akses ke project ini.
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('id', validate.project_id)
      .first()

    // jika user tidak memiliki akses ke project ini.
    if (!currentProject) {
      return response.status(404).send({
        message: 'Project not found / you dont have access to this project',
      })
    }

    // apakah user ini memiliki version ini
    const currentVersion = await currentProject.related('versions').query().where('id', validate.params.id).first()

    // jika user tidak memiliki akses ke project ini.
    if (!currentVersion) {
      return response.status(404).send({
        message: 'Version not found / you dont have access to this version',
      })
    }

    // jika version tinggal 1
    const totalVersion = await db.from('versions').where('project_id', currentProject.id).count('*', 'total').first()

    if (totalVersion.total <= 1) {
      return response.status(409).send({
        message: 'You cant delete the last version',
      })
    }

    await db.transaction(async (trx) => {
      try {
        const topbars = await currentVersion.related('topbars').query().preload('pages').forUpdate()
      
        for (const topbar of topbars) {
          for (const page of topbar.pages) {
            await page.useTransaction(trx).delete()
          }
          await topbar.useTransaction(trx).delete()
        }

        await currentVersion.useTransaction(trx).delete()
        await trx.commit()
      
        return response.status(200).send({
          message: 'Version deleted',
          data: currentVersion,
        })
      } catch (error) {
        await trx.rollback()
        return response.status(500).send({
          message: 'Internal server error',
          error: error.message,
        })
      }
    })
  }

  async reorder({ auth, request, response }: HttpContext) {
    const currentUser = auth.user!;
  
    let validate;
    try {
      validate = await request.validateUsing(reorderVersionValidator);
    } catch (error) {
      return response.status(422).send({
        message: 'Validation failed',
        errors: error.messages,
      });
    }
  
    const currentProject = await currentUser
      .related('projects')
      .query()
      .where('id', validate.project_id)
      .first();
  
    if (!currentProject) {
      return response.status(404).send({
        message: 'Project not found / you don\'t have access to this project',
      });
    }
  
    const versions = validate.versions;
  
    try {
      await db.transaction(async (trx) => {
        for (const [i, version] of versions.entries()) {
          const versionUpdate = await Version.query({ client: trx }).where('id', version).firstOrFail(); 
          versionUpdate.urutan = i;
          await versionUpdate.useTransaction(trx).save(); 
        }
      });
  
      return response.status(200).send({
        data: versions,
        message: 'Version reordered successfully',
      });
    } catch (error) {
      return response.status(500).send({
        message: 'Internal server error',
        error: error.message,
      });
    }
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
