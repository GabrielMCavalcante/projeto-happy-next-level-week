import React, { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link } from "react-router-dom"

function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberUser, setRememberUser] = useState(false)

  async function handleSignin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log({
      email,
      password,
      rememberUser
    })
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
            <input type="checkbox" id="rememberMe" onClick={() => setRememberUser(!rememberUser)} />
            <span id="checkmark"></span>
            Lembrar-me
          </label>

          <Link 
            className="forgot-password" 
            to="/acesso-restrito/esqueci-minha-senha"
          >Esqueci minha senha</Link>
        </div>

        <button className="form-action-btn" type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default Signin