import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

function Authentication() {
  return (
    <>
      <Switch>
        <Route path="/acesso-restrito/login" component={} />
        <Route path="/acesso-restrito/cadastro" component={} />
        <Route path="/acesso-restrito/esqueci-minha-senha" component={} />
        <Route path="/acesso-restrito/recuperar-senha/:token" component={} />
      </Switch>
      <Redirect to="/acesso-restrito/login"/>
    </>
  )
}

export default Authentication