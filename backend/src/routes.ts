import { Router } from 'express'
import { getRepository } from 'typeorm'
import OrphanageModel from './models/Orphanage'

const routes = Router()

routes.post('/orphanages', async (req, res) => {
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
})

export default routes