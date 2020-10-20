import { Router } from "express"
import Controller from "../controllers/dashboard"
import AuthMiddleware from "../middlewares/AuthMiddleware"
import ParamsMiddleware from "../middlewares/checkEmptyOrNullParams"

const routes = Router()
const baseURL = "/dashboard"

routes.get(`${baseURL}`, AuthMiddleware, Controller.index)
routes.get(`${baseURL}/pending`, AuthMiddleware, Controller.indexPending)
routes.put(`${baseURL}/update-orphanage/:id`, ParamsMiddleware, AuthMiddleware, Controller.update)
routes.put(`${baseURL}/update-pending/:id`, ParamsMiddleware, AuthMiddleware, Controller.updatePending)
routes.delete(`${baseURL}/orphanage/:id`, AuthMiddleware, Controller.delete)

export default routes