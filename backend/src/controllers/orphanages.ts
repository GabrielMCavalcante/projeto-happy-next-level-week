import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as yup from 'yup'
import OrphanageModel from '../models/Orphanage'
import OrphanageView from '../views/orphanages'

export default class OrphanagesController {
  static async index(req: Request, res: Response) {
    const orphanagesRepository = getRepository(OrphanageModel)

    const fetchedOrphanages = await orphanagesRepository.find({
      relations: ["images"],
      where: {
        pending_approval: false
      }
    })

    return res.status(200).json({ result: OrphanageView.renderMany(fetchedOrphanages) })
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params

    const orphanagesRepository = getRepository(OrphanageModel)

    const fetchedOrphanage = await orphanagesRepository.findOne(id, {
      relations: ["images"]
    })

    if (fetchedOrphanage) {
      return res.status(200).json({
        found: true,
        result: OrphanageView.render(fetchedOrphanage)
      })
    } else {
      return res.status(404).json({
        found: false,
        message: "No orphanage found with given ID."
      })
    }
  }

  static async create(req: Request, res: Response) {
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

    const orphanagesRepository = getRepository(OrphanageModel)

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
      pending_approval: true,
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

    const createdOrphanage = orphanagesRepository.create(data)

    await orphanagesRepository.save(createdOrphanage)

    return res.status(200).json({
      status: 200,
      type: "Post successfull",
      message: "Orphanage created successfully.",
      debug: createdOrphanage
    })
  }
}