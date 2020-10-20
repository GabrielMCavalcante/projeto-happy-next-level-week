import { Request, Response } from "express"
import * as yup from "yup"
import { getRepository } from "typeorm"
import OrphanageModel from "../models/Orphanage"
import DashboardView from "../views/dashboard"
import OrphanageView from "../views/orphanages"

async function fetchOrphanages(pending_approval: boolean) {
  const orphanagesRepository = getRepository(OrphanageModel)

  const result = await orphanagesRepository.find({
    where: { pending_approval }
  })

  return result
}

export default class DashboardController {
  static async index(req: Request, res: Response) {
    const result = await fetchOrphanages(false)

    return res.status(200).json({
      status: 200,
      results: DashboardView.renderMany(result)
    })
  }

  static async indexPending(req: Request, res: Response) {
    const result = await fetchOrphanages(true)

    return res.status(200).json({
      status: 200,
      results: DashboardView.renderMany(result)
    })
  }

  static async indexById(req: Request, res: Response) {
    const id = Number(req.params.id)

    const orphanagesRepository = getRepository(OrphanageModel)

    const orphanage = await orphanagesRepository.findOne(id, {
      relations: ["images"]
    })

    if (!orphanage) {
      return res.status(404).json({
        status: 404,
        message: "No orphanage found with given id."
      })
    }

    return res.status(200).json({
      status: 200,
      result: OrphanageView.render(orphanage)
    })
  }

  static async update(req: Request, res: Response) {
    const {
      name,
      about,
      latitude,
      longitude,
      instructions,
      opening_hours,
      open_on_weekends,
      whatsapp
    } = req.body

    const id = Number(req.params.id)

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Missing orphanage id on request parameters."
      })
    }

    const orphanagesRepository = getRepository(OrphanageModel)

    // Verifying if an orphanage exists with given id
    const orphanage = await orphanagesRepository.findOne(id)

    if (!orphanage) {
      return res.status(404).json({
        status: 404,
        message: "No orphanage exists with given id."
      })
    }

    const requestImages = req.files as Express.Multer.File[]

    const images = requestImages.map(image => ({
      path: image.filename
    }))

    const data = {
      name,
      about,
      latitude,
      longitude,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === "true" ? true : false,
      pending_approval: false,
      images,
      whatsapp
    }

    const schema = yup.object().shape({
      name: yup.string().required(),
      about: yup.string().required().max(300),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      instructions: yup.string().required(),
      opening_hours: yup.string().required(),
      open_on_weekends: yup.boolean().required(),
      images: yup.array(
        yup.object().shape({
          path: yup.string().required()
        })
      ),
      whatsapp: yup.number().required()
    })

    try {
      await schema.validate(data, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.errors
      })
    }

    await orphanagesRepository.delete(id)
    
    const updatedOrphanage = orphanagesRepository.create({id, ...data})
    await orphanagesRepository.save(updatedOrphanage)

    return res.status(200).json({
      status: 200,
      message: "Orphanage updated successfully.",
    })
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Missing orphanage id on request parameters."
      })
    }

    const orphanagesRepository = getRepository(OrphanageModel)

    // Verifying if an orphanage exists with given id
    const orphanage = await orphanagesRepository.findOne(id)

    if (!orphanage) {
      return res.status(404).json({
        status: 404,
        message: "No orphanage exists with given id or it has been deleted."
      })
    }

    await orphanagesRepository.delete(id)
    return res.status(200).json({
      status: 200,
      message: "Deleted orphanage successfully."
    })
  }
}