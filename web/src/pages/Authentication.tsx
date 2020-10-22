import AuthenticationScreen from "components/AuthenticationScreen"
import React from "react"
import { Route, Redirect, Switch, useHistory, useParams } from "react-router-dom"
import Feedback from "components/Feedback"

// Pages
import Signin from "./Signin"
import Signup from "./Signup"
import ForgotPassword from "./ForgotPassword"

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
        action: () => navigation.replace("/dashboard")
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

  const failureByUserFeedback = (
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
          ? failureByUserFeedback
          : failureFeedback
      )
  )
}

function Authentication() {
  return (
    <>
      <Switch>
        <Route path="/acesso-restrito/login" exact>
          <AuthenticationScreen formElement={<Signin />} />
        </Route>
        <Route path="/acesso-restrito/cadastro" exact>
          <AuthenticationScreen type="inverted" formElement={<Signup />} />
        </Route>
        <Route path="/acesso-restrito/esqueci-minha-senha" exact>
          <AuthenticationScreen formElement={<ForgotPassword />} />
        </Route>
        <Route path="/acesso-restrito/login/:status" component={SigninFeedback} />
        <Route path="/acesso-restrito/cadastro/:status" component={SignupFeedback} />
        <Route path="/acesso-restrito/esqueci-minha-senha/:status" component={ForgotPasswordFeedback} />
        <Redirect to="/acesso-restrito/login" />
      </Switch>
    </>
  )
}

export default Authentication