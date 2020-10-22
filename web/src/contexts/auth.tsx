import React, { createContext, useState, useContext } from "react"
import api from "services/axios-config"
import * as AT from "./auth-types"

const AuthContext = createContext({} as AT.AuthContextValues)

export const AuthProvider: React.FC = ({ children }) => {

  const [token, setToken] = useState<AT.Token>(null)
  const [loading, setLoading] = useState(false)

  function setContextToken(token: AT.Token) {
    setToken(token)
  }

  async function signin(userAccount: AT.UserAccount) {
    setLoading(true)

    const response = await api.post("/auth/signin", userAccount)

    const data = response.data as AT.SigninResponseData

    if (data.status === 200) {
      setToken(data.token)

      if (userAccount.remember_user) {
        localStorage.setItem("happy:signin:token", data.token)
      }
    }

    setLoading(false)

    return data.status
  }

  async function signup(userData: AT.UserData) {
    setLoading(true)

    try {
      const response = await api.post("/auth/signup", userData)

      const data = response.data as AT.SignupResponseData

      setLoading(false)

      return data.status
    } catch (err) {
      const error = { ...err }.response.data as AT.SignupResponseData

      setLoading(false)

      return error.status
    }
  }

  async function signout() {
    localStorage.removeItem("happy:signin:token")
    setToken(null)
  }

  async function requestPasswordResetToken(email: string) {
    setLoading(true)

    try {
      const response = await api.post("/auth/password-recovery/request-token", { email })

      const data = response.data as AT.RequestPasswordRecoveryTokenData

      setLoading(false)

      return data.status
    } catch (err) {
      const error = { ...err }.response.data as AT.RequestPasswordRecoveryTokenData

      setLoading(false)

      return error.status
    }
  }

  async function resetPassword(resetData: AT.PasswordResetData) {
    setLoading(true)

    try {
      const response = await api.put("/auth/password-recovery/reset-password",
        { password: resetData.password },
        { headers: { recovery_token: resetData.token } }
      )

      const data = response.data as AT.ResetPasswordData

      setLoading(false)

      return data.status
    } catch (err) {
      const error = {...err}.response.data as AT.ResetPasswordData

      setLoading(false)

      return error.status
    }
  }

  return (
    <AuthContext.Provider value={{
      signedIn: !!token,
      token,
      loading,
      setContextToken,
      signin,
      signup,
      signout,
      requestPasswordResetToken,
      resetPassword
    }}>{children}</AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)