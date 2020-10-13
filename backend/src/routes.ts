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
    
    const arrayOfEmptyAttributes = []
    for (const attr in req.body) {
        if (req.body[attr] === null || req.body[attr] === "") {
            arrayOfEmptyAttributes.push(attr)
        }
    }

    if (arrayOfEmptyAttributes.length > 0) {
        return res.status(400).json({
            status: 400,
            type: "Required field empty or null",
            message: "The following fields are required: "
            + arrayOfEmptyAttributes.join(", ")
        })
    }

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