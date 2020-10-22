import React, { useState, useContext, createContext } from "react"
import api from "services/axios-config"
import * as DT from "./dashboard-types"

// Contexts
import useAuth from "contexts/auth"
import { OrphanagesData } from "./dashboard-types"

const DashboardContext = createContext({} as DT.DashboardContextValues)

export const DashboardProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [orphanages, setOrphanages] = useState<OrphanagesData | null>(null)
  const authContext = useAuth()

  async function fetchOrphanages(storedToken: string | null) {
    setLoading(true)

    const headers = {
      authorization: `Bearer ${storedToken ? storedToken : authContext.token}`,
    }

    try {
      const response = await api.get("/dashboard", { headers })

      setOrphanages({
        registered: response.data.results.registered,
        pending: response.data.results.pending
      })

      setLoading(false)

      return response.data.status
    } catch (err) {
      const error = {...err}.response.status

      setLoading(false)

      return error
    }
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
        fetchOrphanages,
        fetchOrphanageDetails,
        updateOrphanage,
        deleteOrphanage,
        orphanages,
        loading
      }}
    >{children}</DashboardContext.Provider>
  )
}

function useDashboard() {
  return useContext(DashboardContext)
}

export default useDashboard