import AuthenticationScreen from "components/AuthenticationScreen"
import React from "react"
import { Route, Redirect, Switch, useHistory, useParams } from "react-router-dom"
import Feedback from "components/Feedback"

// Pages
import Signin from "./Signin"

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

function Authentication() {
  return (
    <>
      <Switch>
        <Route path="/acesso-restrito/login" exact>
          <AuthenticationScreen formElement={<Signin />} />
        </Route>
        <Route path="/acesso-restrito/login/:status" component={SigninFeedback} />
        {/* <Route path="/acesso-restrito/cadastro" component={} />
        <Route path="/acesso-restrito/esqueci-minha-senha" component={} />
        <Route path="/acesso-restrito/recuperar-senha/:token" component={} /> */}
        <Redirect to="/acesso-restrito/login" />
      </Switch>
    </>
  )
}

export default Authentication