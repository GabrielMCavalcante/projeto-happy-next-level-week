import AuthenticationScreen from "components/AuthenticationScreen"
import React from "react"
import { Route, Redirect, Switch, useHistory, useParams } from "react-router-dom"
import Feedback from "components/Feedback"

// Pages
import Signin from "./Signin"
import Signup from "./Signup"
import ForgotPassword from "./ForgotPassword"
import ResetPassword from "./ResetPassword"
import Dashboard from "./Dashboard"

function SigninFeedback() {
  const navigation = useHistory()
  const { status } = useParams<{ status: string }>()

  const successFeedback = (
    <Feedback
      title="Sucesso!"
      subtitle="Login realizado com sucesso. Aproveite!"
      type="success"
      actionButtons={[{
        type: "success",
        label: "Entrar na dashboard",
        action: () => navigation.replace("/acesso-restrito/dashboard")
      }]}
    />
  )

  const failureFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Ocorreu algum erro ao tentar fazer login.
      Tente novamente mais tarde."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Voltar ao login",
          action: () => navigation.replace("/acesso-restrito/login")
        },
        {
          type: "danger",
          label: "Voltar à tela principal",
          action: () => navigation.replace("/")
        }
      ]}
    />
  )

  return status === "sucesso" ? successFeedback : failureFeedback
}

function SignupFeedback() {
  const navigation = useHistory()
  const { status } = useParams<{ status: string }>()

  const successFeedback = (
    <Feedback
      title="Sucesso!"
      subtitle="Cadastro realizado com sucesso. Aproveite!"
      type="success"
      actionButtons={[{
        type: "success",
        label: "Fazer login",
        action: () => navigation.replace("/acesso-restrito/login")
      }]}
    />
  )

  const failureByUserFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Já existe uma conta com este endereço de email!"
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Voltar ao cadastro",
          action: () => navigation.replace("/acesso-restrito/cadastro")
        },
        {
          type: "danger",
          label: "Esqueci minha senha",
          action: () => navigation.replace("/acesso-restrito/esqueci-minha-senha")
        }
      ]}
    />
  )

  const failureFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Ocorreu algum erro ao tentar fazer login.
      Tente novamente mais tarde."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Voltar ao cadastro",
          action: () => navigation.replace("/acesso-restrito/cadastro")
        },
        {
          type: "danger",
          label: "Voltar à tela principal",
          action: () => navigation.replace("/")
        }
      ]}
    />
  )

  return (
    status === "sucesso"
      ? successFeedback
      : (
        status === "usuario-ja-existe"
          ? failureByUserFeedback
          : failureFeedback
      )
  )
}

function ForgotPasswordFeedback() {
  const navigation = useHistory()
  const { status } = useParams<{ status: string }>()

  const successFeedback = (
    <Feedback
      title="Sucesso!"
      subtitle="Agora é só acessar o seu email e clicar no link de recuperação de senha
      e resetar sua senha!"
      type="success"
      actionButtons={[{
        type: "success",
        label: "Voltar ao login",
        action: () => navigation.replace("/acesso-restrito/login")
      }]}
    />
  )

  const failureByNoEmailFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Não existe nenhuma conta com este endereço de email!"
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Tentar novamente",
          action: () => navigation.replace("/acesso-restrito/esqueci-minha-senha")
        },
        {
          type: "danger",
          label: "Voltar ao login",
          action: () => navigation.replace("/acesso-restrito/login")
        }
      ]}
    />
  )

  const failureFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Ocorreu algum erro ao enviar o email. 
      Por favor, tente novamente mais tarde."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Voltar ao login",
          action: () => navigation.replace("/acesso-restrito/login")
        },
        {
          type: "danger",
          label: "Voltar à tela principal",
          action: () => navigation.replace("/")
        }
      ]}
    />
  )

  return (
    status === "sucesso"
      ? successFeedback
      : (
        status === "email-nao-existe"
          ? failureByNoEmailFeedback
          : failureFeedback
      )
  )
}

function ResetPasswordFeedback() {
  const navigation = useHistory()
  const { status } = useParams<{ status: string }>()

  const successFeedback = (
    <Feedback
      title="Sucesso!"
      subtitle="Sua senha foi redefinida com sucesso. Aproveite!"
      type="success"
      actionButtons={[{
        type: "success",
        label: "Voltar ao login",
        action: () => navigation.replace("/acesso-restrito/login")
      }]}
    />
  )

  const failureByNoTokenFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Não foi encontrado nenhum token de recuperação de senha. Gere um na página
      de 'Esqueci minha senha' e tente novamente."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Acessar 'Esqueci minha senha'",
          action: () => navigation.replace("/acesso-restrito/esqueci-minha-senha")
        }
      ]}
    />
  )

  const failureByInvalidTokenFeedback = (
    <Feedback
      title="Oops!"
      subtitle="O token de recuperação é inválido ou já expirou. Gere um novo 
      na tela de 'Esqueci minha senha' e tente novamente."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Acessar 'Esqueci minha senha'",
          action: () => navigation.replace("/acesso-restrito/esqueci-minha-senha")
        }
      ]}
    />
  )

  const failureFeedback = (
    <Feedback
      title="Oops!"
      subtitle="Ocorreu algum erro ao redefinir a senha. Tente novamente mais tarde."
      type="error"
      actionButtons={[
        {
          type: "danger",
          label: "Voltar ao login",
          action: () => navigation.replace("/acesso-restrito/login")
        },
        {
          type: "danger",
          label: "Voltar à tela principal",
          action: () => navigation.replace("/")
        }
      ]}
    />
  )

  return (
    status === "sucesso"
      ? successFeedback
      : (
        status === "token-nao-encontrado"
          ? failureByNoTokenFeedback
          : (
            status === "token-invalido"
              ? failureByInvalidTokenFeedback
              : failureFeedback
          )
      )
  )
}

function Authentication() {
  return (
    <>
      <Switch>
        <Route path="/acesso-restrito/login" exact>
          <AuthenticationScreen returnTo="/" formElement={<Signin />} />
        </Route>
        <Route path="/acesso-restrito/cadastro" exact>
          <AuthenticationScreen
            type="inverted"
            returnTo="/acesso-restrito/login"
            formElement={<Signup />}
          />
        </Route>
        <Route path="/acesso-restrito/esqueci-minha-senha" exact>
          <AuthenticationScreen
            returnTo="/acesso-restrito/login"
            formElement={<ForgotPassword />}
          />
        </Route>
        <Route path="/acesso-restrito/recuperar-senha/:token" exact>
          <AuthenticationScreen returnBtn={false} formElement={<ResetPassword />} />
        </Route>
        <Route path="/acesso-restrito/login/:status" component={SigninFeedback} />
        <Route path="/acesso-restrito/cadastro/:status" component={SignupFeedback} />
        <Route path="/acesso-restrito/esqueci-minha-senha/:status" component={ForgotPasswordFeedback} />
        <Route path="/acesso-restrito/recuperar-senha/status/:status" component={ResetPasswordFeedback} />
        <Route path="/acesso-restrito/dashboard" component={Dashboard} />
        <Redirect to="/acesso-restrito/login" />
      </Switch>
    </>
  )
}

export default Authentication