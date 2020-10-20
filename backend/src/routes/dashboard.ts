import { Router } from "express"
import DashboardController from "../controllers/dashboard"
import AuthMiddleware from "../middlewares/AuthMiddleware"
import checkEmptyOrNullParams from "../middlewares/checkEmptyOrNullParams"

const routes = Router()

routes.get("/dashboard/orphanages", AuthMiddleware, DashboardController.index)
routes.get("/dashboard/orphanages/pending", AuthMiddleware, DashboardController.indexPending)
routes.put("/dashboard/update-orphanage/:id", checkEmptyOrNullParams, AuthMiddleware, DashboardController.update)
routes.put("/dashboard/update-pending/:id", checkEmptyOrNullParams, AuthMiddleware, DashboardController.updatePending)
routes.delete("/dashboard/orphanage/:id", AuthMiddleware, DashboardController.delete)

export default routes