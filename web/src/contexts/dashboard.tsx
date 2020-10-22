import React, { useState, useContext, createContext } from "react"
import api from "services/axios-config"
import * as DT from "./dashboard-types"

// Contexts
import useAuth from "contexts/auth"

const DashboardContext = createContext({} as DT.DashboardContextValues)

export const DashboardProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const authContext = useAuth()

  async function fetchRegisteredOrphanages() {
    setLoading(true)

    try {
      const response = await api.get("/dashboard", {
        headers: {
          authorization: `Bearer ${authContext.token}`,
        }
      })

      const data = response.data as DT.FetchOrphanagesData

      setLoading(false)

      return data.status
    } catch (err) {
      const error = {...err}.response.data as DT.FetchOrphanagesData

      setLoading(false)

      return error.status
    }
  }

  async function fetchPendingOrphanages() {

  }

  async function fetchOrphanageDetails(id: number) {

  }

  async function updateOrphanage(id: number) {

  }

  async function deleteOrphanage(id: number) {

  }

  return (
    <DashboardContext.Provider
      value={{
        fetchRegisteredOrphanages,
        fetchPendingOrphanages,
        fetchOrphanageDetails,
        updateOrphanage,
        deleteOrphanage,
        loading
      }}
    >{children}</DashboardContext.Provider>
  )
}

function useDashboard() {
  return useContext(DashboardContext)
}

export default useDashboard