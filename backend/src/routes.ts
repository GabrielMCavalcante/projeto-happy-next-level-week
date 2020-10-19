import { Router } from "express"
import multer from "multer"
import multerConfig from "./config/upload"

const upload = multer(multerConfig)

// Controllers
import OrphanagesController from "./controllers/orphanages"
import AuthController from "./controllers/authentication"

// Middlewares
import checkEmptyOrNullParams from "./middlewares/checkEmptyOrNullParams"

const routes = Router()

// Orphanages
routes.get("/orphanages", OrphanagesController.index)
routes.get("/orphanages/:id", OrphanagesController.findById)
routes.post("/orphanages", 
    checkEmptyOrNullParams, 
    upload.array("images"), 
OrphanagesController.create)

// Authentication
routes.post("/auth/signup", AuthController.signup)
routes.post("/auth/signin", AuthController.signin)
routes.post("/auth/password-recovery/request-token", AuthController.requestRecoveryToken)
routes.put("/auth/password-recovery/reset-password", AuthController.resetPassword)

export default routes