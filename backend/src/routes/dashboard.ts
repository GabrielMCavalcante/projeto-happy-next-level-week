import { Router } from "express"
import multer from "multer"
import multerConfig from "../config/upload"
import Controller from "../controllers/dashboard"
import AuthMiddleware from "../middlewares/AuthMiddleware"
import ParamsMiddleware from "../middlewares/checkEmptyOrNullParams"

const upload = multer(multerConfig)
const routes = Router()
const baseURL = "/dashboard"

routes.get(`${baseURL}`, AuthMiddleware, Controller.index)
routes.get(`${baseURL}/pending`, AuthMiddleware, Controller.indexPending)
routes.put(`${baseURL}/update-orphanage/:id`,
  ParamsMiddleware,
  AuthMiddleware,
  upload.array("images"),
  Controller.update)
routes.delete(`${baseURL}/orphanage/:id`, AuthMiddleware, Controller.delete)

export default routes