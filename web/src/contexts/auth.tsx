import React, { createContext, useState, useContext } from "react"
import api from "services/axios-config"
import * as AT from "./auth-types"

const AuthContext = createContext({} as AT.AuthContextValues)

export const AuthProvider: React.FC = ({ children }) => {

  const [token, setToken] = useState<AT.Token>(null)
  const [error, setError] = useState<AT.Error>(null)
  const [loading, setLoading] = useState(false)

  async function signin(userAccount: AT.UserAccount) {
    setLoading(true)
    setError(null)
    const response = await api.post("/auth/signin", userAccount)
    
    const data = response.data as AT.SigninResponseData
    
    if (data.status === 200) {
      setToken(data.token)

      sessionStorage.setItem("happy:signin:token", data.token)

      if (userAccount.remember_user) {
        localStorage.setItem("happy:signin:token", data.token)
      }
    } else {
      setError(data.message)
    }

    setLoading(false)

    return data.status
  }

  async function signup() {

  }

  async function signout() {
    sessionStorage.removeItem("happy:signin:token")
    localStorage.removeItem("happy:signin:token")
  }

  async function requestPasswordResetToken() {

  }

  async function updateUserPassword() {

  }

  return (
    <AuthContext.Provider value={{
      signedIn: !!token,
      token,
      loading,
      error,
      signin,
      signup,
      signout,
      requestPasswordResetToken,
      updateUserPassword
    }}>{children}</AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)