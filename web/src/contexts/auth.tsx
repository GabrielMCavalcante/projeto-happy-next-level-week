import React, { createContext, useState, useContext } from "react"
import api from "services/axios-config"
import * as AT from "./auth-types"

const AuthContext = createContext({} as AT.AuthContextValues)

export const AuthProvider: React.FC = ({ children }) => {

  const [token, setToken] = useState<AT.Token>(null)
  const [loading, setLoading] = useState(false)

  async function signin(userAccount: AT.UserAccount) {
    setLoading(true)

    const response = await api.post("/auth/signin", userAccount)

    const data = response.data as AT.SigninResponseData

    if (data.status === 200) {
      setToken(data.token)

      sessionStorage.setItem("happy:signin:token", data.token)

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
      const error = {...err}.response.data as AT.SignupResponseData

      setLoading(false)

      return error.status
    }
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
      signin,
      signup,
      signout,
      requestPasswordResetToken,
      updateUserPassword
    }}>{children}</AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)