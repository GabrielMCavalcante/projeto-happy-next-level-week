import React, { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link, useHistory } from "react-router-dom"
import Loader from "react-loader-spinner"

// Contexts
import useAuth from "contexts/auth"

function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember_user, setRememberUser] = useState(false)
  const navigation = useHistory()
  const authContext = useAuth()

  async function handleSignin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const sts = await authContext.signin({ email, password, remember_user })

    let status: string

    if (sts === 200) {
      status = "sucesso"
    } else {
      status = "erro"
    }

    navigation.replace("/acesso-restrito/login/" + status)
  }

  return (
    <div className="content-wrapper">
      <h1>Fazer login</h1>

      <form onSubmit={handleSignin}>
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

        <div className="horizontal-group">
          <label htmlFor="rememberMe">
            <input type="checkbox" id="rememberMe" onClick={() => setRememberUser(!remember_user)} />
            <span id="checkmark"></span>
            Lembrar-me
          </label>

          <Link
            className="styled-link"
            to="/acesso-restrito/esqueci-minha-senha"
          >Esqueci minha senha</Link>
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
              : "Entrar"
          }
        </button>

        <p className="change-method-text">
          Não tem uma conta?&nbsp;
          <Link to="/acesso-restrito/cadastro" className="styled-link">
            Cadastre uma conta aqui.
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signin