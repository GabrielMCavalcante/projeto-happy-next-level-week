import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { AuthProvider } from "contexts/auth"
import { DashboardProvider } from "contexts/dashboard"

// Styles
import "assets/styles/global.css"
import "leaflet/dist/leaflet.css"

const app = (
  <AuthProvider>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </AuthProvider>
)

ReactDOM.render(app, document.getElementById("root"))