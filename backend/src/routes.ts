import { Router } from 'express'
import OrphanagesController from './controllers/orphanages'

// Middlewares
import checkEmptyOrNullParams from './middlewares/checkEmptyOrNullParams'

const routes = Router()

// Orphanages
routes.get('/orphanages', OrphanagesController.index)
routes.get('/orphanages/:id', OrphanagesController.findById)
routes.post('/orphanages', checkEmptyOrNullParams, OrphanagesController.create)

export default routes