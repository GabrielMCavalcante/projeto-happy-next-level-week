import React, { useState } from "react"
import { FiEyeOff, FiEye } from "react-icons/fi"
import { Link, useHistory } from "react-router-dom"
import Loader from "react-loader-spinner"

// Contexts
import useAuth from "contexts/auth"

function Signup() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useHistory()
  const authContext = useAuth()

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const sts = await authContext.signup({ email, password })
    
    let status: string

    if (sts === 201) {
      status = "sucesso"
    } else if (sts === 409) {
      status = "usuario-ja-existe"
    } else {
      status = "erro"
    }

    navigation.replace("/acesso-restrito/cadastro/" + status)
  }

  return (
    <div className="content-wrapper">
      <h1>Fazer cadastro</h1>
      <h3>Para acessar a dashboard de orfanatos basta preencher os dados abaixo.</h3>

      <form onSubmit={handleSignup}>
        <div className="input-block">
          <label htmlFor="email">Email</label>
          <input
            required
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-block hide-show">
          <label htmlFor="password">Senha</label>
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
          disabled={
            authContext.loading ||
            !email || !password
          }
          className="form-action-btn"
          type="submit"
        >
          {
            authContext.loading
              ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
              : "Cadastrar"
          }
        </button>

        <p className="change-method-text">
          Já tem uma conta?&nbsp;
          <Link to="/acesso-restrito/login" className="styled-link">
            Faça login aqui.
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup