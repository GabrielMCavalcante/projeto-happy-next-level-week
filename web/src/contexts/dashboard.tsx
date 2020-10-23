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
  const [reFetch, setRefetch] = useState(true)
  const authContext = useAuth()

  function callRefetch() {
    setRefetch(true)
  }

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
      setRefetch(false)

      return response.data.status
    } catch (err) {
      const error = { ...err }.response.status

      setLoading(false)
      setRefetch(false)

      return error
    }
  }

  async function fetchOrphanageDetails(id: number) {
    const headers = {
      authorization: "Bearer " + authContext.token
    }

    try {
      setLoading(true)
      const response = await api.get(`/dashboard/orphanage/details/${id}`, { headers })

      setLoading(false)

      return response.data
    } catch (err) {
      setLoading(false)

      return { ...err }.response
    }
  }

  async function updateOrphanage(id: number, formData: FormData) {
    const headers = {
      authorization: "Bearer " + authContext.token
    }

    try {
      setLoading(true)

      const response = await api.put(`/dashboard/orphanage/update/${id}`,
        formData, { headers }
      )

      setLoading(false)
      
      return response.status
    } catch (err) {
      setLoading(false)

      return { ...err }.response.status
    }
  }

  async function deleteOrphanage(id: number) {
    const headers = {
      authorization: "Bearer " + authContext.token
    }

    try {
      setLoading(true)

      const response = await api.delete(`/dashboard/orphanage/update/${id}`, { headers })

      setLoading(false)
      
      return response.status
    } catch (err) {
      setLoading(false)

      return { ...err }.response.status
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        fetchOrphanages,
        fetchOrphanageDetails,
        updateOrphanage,
        deleteOrphanage,
        callRefetch,
        reFetch,
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