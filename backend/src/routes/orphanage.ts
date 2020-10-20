import { Router } from "express"
import multer from "multer"
import multerConfig from "../config/upload"
const upload = multer(multerConfig)

import Controller from "../controllers/orphanages"
import ParamsMiddleware from "../middlewares/checkEmptyOrNullParams"

const routes = Router()
const baseURL = "/orphanages"

routes.get(`${baseURL}`, Controller.index)
routes.get(`${baseURL}/:id`, Controller.findById)
routes.post(`${baseURL}`,
  ParamsMiddleware,
  upload.array("images"),
  Controller.create)

export default routes