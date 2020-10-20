import { Router } from "express"

// Routes
import orphanageRoutes from "./orphanage"
import authenticationRoutes from "./authentication"
import dashboardRoutes from "./dashboard"

const routes = Router()

// Orphanages
routes.use(orphanageRoutes)

// Authentication
routes.use(authenticationRoutes)

// Dashboard
routes.use(dashboardRoutes)

export default routes