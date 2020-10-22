import React, { useState } from "react"
import { FiEyeOff, FiEye } from "react-icons/fi"
import Loader from "react-loader-spinner"
import { useHistory, useParams } from "react-router-dom"
import useAuth from "contexts/auth"

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useHistory()
  const { token } = useParams() as { token: string }
  const authContext = useAuth()

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const sts = await authContext.resetPassword({ password, token })

    let status: string

    if (sts === 200) {
      status = "sucesso"
    } else if (sts === 401) {
      status = "token-invalido"
    } else if (sts === 404) {
      status = "token-nao-encontrado"
    } else  {
      status = "erro"
    }

    navigation.replace("/acesso-restrito/recuperar-senha/status/" + status)
  }

  return (
    <div className="content-wrapper">
      <h1>Redefinição de senha</h1>
      <h3>Escolha uma nova senha para você acessar o dashboard do Happy</h3>

      <form onSubmit={handleResetPassword}>
        <div className="input-block hide-show">
          <label htmlFor="password">Nova senha</label>
          <input
            required
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-hide-btn"
          >
            {
              showPassword
                ? <FiEyeOff size={20} color="#8FA7B3" />
                : <FiEye size={20} color="#8FA7B3" />
            }
          </button>
        </div>

        <button
          disabled={authContext.loading || !password}
          className="form-action-btn"
          type="submit"
        >
          {
            authContext.loading
              ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
              : "Cadastrar"
          }
        </button>
      </form>
    </div>
  )
}

export default ResetPassword