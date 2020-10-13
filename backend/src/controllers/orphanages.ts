import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import OrphanageModel from '../models/Orphanage'

export default class OrphanagesController {
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

        const createdOrphanage = orphanagesRepository.create({
            name,
            about,
            latitude,
            longitude,
            instructions,
            opening_hours,
            open_on_weekends
        })

        await orphanagesRepository.save(createdOrphanage)

        return res.status(200).json({
            status: 200,
            type: "Post successfull",
            message: "Orphanage created successfully."
        })
    }
}