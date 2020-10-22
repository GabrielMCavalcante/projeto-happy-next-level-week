import React, { useState } from "react"
import Loader from "react-loader-spinner"
import { useHistory } from "react-router-dom"
import useAuth from "contexts/auth"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const navigation = useHistory()
  const authContext = useAuth()

  async function handleRequestPasswordRecoveryToken(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const sts = await authContext.requestPasswordResetToken(email)

    let status: string

    if (sts === 200) {
      status = "sucesso"
    } else if (sts === 404) {
      status = "email-nao-existe"
    } else {
      status = "erro"
    }

    navigation.replace("/acesso-restrito/esqueci-minha-senha/" + status)
  }

  return (
    <div className="content-wrapper">
      <h1>Esqueceu a senha?</h1>
      <h3>Sem problemas. Sua redefinição de senha será enviada para o e-mail cadastrado.</h3>

      <form onSubmit={handleRequestPasswordRecoveryToken}>
        <div className="input-block">
          <label htmlFor="email">Email</label>
          <input
            required
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          disabled={authContext.loading || !email}
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

export default ForgotPassword