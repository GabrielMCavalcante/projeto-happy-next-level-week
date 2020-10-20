import { Router } from "express"
import ParamsMiddleware from "../middlewares/checkEmptyOrNullParams"
import Controller from "../controllers/authentication"

const routes = Router()
const baseURL = "/auth"

routes.post(`${baseURL}/signup`, ParamsMiddleware, Controller.signup)
routes.post(`${baseURL}/signin`, ParamsMiddleware, Controller.signin)
routes.post(`${baseURL}/password-recovery/request-token`,
  ParamsMiddleware,
  Controller.requestRecoveryToken)
routes.put(`${baseURL}/password-recovery/reset-password`,
  ParamsMiddleware,
  Controller.resetPassword)

export default routes