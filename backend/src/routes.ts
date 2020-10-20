import { Router } from "express"
import multer from "multer"
import multerConfig from "./config/upload"

const upload = multer(multerConfig)

// Controllers
import OrphanagesController from "./controllers/orphanages"
import AuthController from "./controllers/authentication"
import DashboardController from "./controllers/dashboard"

// Middlewares
import checkEmptyOrNullParams from "./middlewares/checkEmptyOrNullParams"
import AuthMiddleware from "./middlewares/AuthMiddleware"

const routes = Router()

// Orphanages
routes.get("/orphanages", OrphanagesController.index)
routes.get("/orphanages/:id", OrphanagesController.findById)
routes.post("/orphanages",
  checkEmptyOrNullParams,
  upload.array("images"),
  OrphanagesController.create)

// Authentication
routes.post("/auth/signup", checkEmptyOrNullParams, AuthController.signup)
routes.post("/auth/signin", checkEmptyOrNullParams, AuthController.signin)
routes.post("/auth/password-recovery/request-token",
  checkEmptyOrNullParams,
  AuthController.requestRecoveryToken)
routes.put("/auth/password-recovery/reset-password",
  checkEmptyOrNullParams,
  AuthController.resetPassword)

// Dashboard
routes.get("/dashboard/orphanages", AuthMiddleware, DashboardController.index)
routes.get("/dashboard/orphanages/pending", AuthMiddleware, DashboardController.indexPending)
routes.put("/dashboard/update-orphanage/:id", checkEmptyOrNullParams, AuthMiddleware, DashboardController.update)
routes.put("/dashboard/update-pending/:id", checkEmptyOrNullParams, AuthMiddleware, DashboardController.updatePending)
routes.delete("/dashboard/orphanage/:id", AuthMiddleware, DashboardController.delete)

export default routes