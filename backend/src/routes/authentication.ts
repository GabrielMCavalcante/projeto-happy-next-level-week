import { Router } from "express"
import checkEmptyOrNullParams from "../middlewares/checkEmptyOrNullParams"
import AuthController from "../controllers/authentication"

const routes = Router()

routes.post("/auth/signup", checkEmptyOrNullParams, AuthController.signup)
routes.post("/auth/signin", checkEmptyOrNullParams, AuthController.signin)
routes.post("/auth/password-recovery/request-token",
  checkEmptyOrNullParams,
  AuthController.requestRecoveryToken)
routes.put("/auth/password-recovery/reset-password",
  checkEmptyOrNullParams,
  AuthController.resetPassword)

export default routes