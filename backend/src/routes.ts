import { Router } from 'express'
import OrphanagesController from './controllers/orphanages'
import multer from 'multer'
import multerConfig from './config/upload'

const upload = multer(multerConfig)


// Middlewares
import checkEmptyOrNullParams from './middlewares/checkEmptyOrNullParams'

const routes = Router()

// Orphanages
routes.get('/orphanages', OrphanagesController.index)
routes.get('/orphanages/:id', OrphanagesController.findById)
routes.post('/orphanages', 
    checkEmptyOrNullParams, 
    upload.array("images"), 
OrphanagesController.create)

export default routes