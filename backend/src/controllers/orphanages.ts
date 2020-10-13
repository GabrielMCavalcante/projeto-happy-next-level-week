import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import OrphanageModel from '../models/Orphanage'

export default class OrphanagesController {
    static async index(req: Request, res: Response) {
        const orphanagesRepository = getRepository(OrphanageModel)

        const fetchedOrphanages = await orphanagesRepository.find()
        
        return res.status(200).json({ orphanages: fetchedOrphanages})
    }

    static async findById(req: Request, res: Response) {
        const { id } = req.params

        const orphanagesRepository = getRepository(OrphanageModel)

        const fetchedOrphanage = await orphanagesRepository.findOne(id)

        if (fetchedOrphanage) {
            return res.status(200).json({
                found: true,
                fetchedOrphanage
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
            open_on_weekends
        } = req.body

        const orphanagesRepository = getRepository(OrphanageModel)

        const requestImages = req.files as Express.Multer.File[]

        const images = requestImages.map(image => ({
            path: image.filename
        }))

        const createdOrphanage = orphanagesRepository.create({
            name,
            about,
            latitude,
            longitude,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        })

        await orphanagesRepository.save(createdOrphanage)

        return res.status(200).json({
            status: 200,
            type: "Post successfull",
            message: "Orphanage created successfully.",
            debug: createdOrphanage
        })
    }
}