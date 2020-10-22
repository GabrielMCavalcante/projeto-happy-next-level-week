import useDashboard from "contexts/dashboard"
import React, { useEffect, useState } from "react"
import { Route, Redirect, Switch, useHistory } from "react-router-dom"

// Contexts
import useAuth from "contexts/auth"

// Pages
import Orphanages from "./Orphanages"

// Components
import Feedback from "components/Feedback"

function Dashboard() {
  const [feedback, setFeedback] = useState<JSX.Element | null>(null)
  const authContext = useAuth()
  const dashboardContext = useDashboard()
  const navigation = useHistory()

  useEffect(() => {
    (async function () {
      const storedToken = localStorage.getItem("happy:signin:token")

      const status = await dashboardContext.fetchOrphanages(storedToken)

      if (status === 200) {
        navigation.replace("/acesso-restrito/dashboard/orfanatos")
      } else if (status === 401) {
        setFeedback(
          <Feedback
            type="error"
            title="Oops!"
            subtitle="Você não tem autorização para acessar este conteúdo.
            Faça login e tente novamente."
            actionButtons={[{
              label: "Voltar ao login",
              type: "danger",
              action: () => navigation.replace("/acesso-restrito/login")
            }]}
          />
        )
      } else {
        setFeedback(
          <Feedback
            type="error"
            title="Oops!"
            subtitle="Ocorreu algum erro ao tentar carregar os orfanatos. 
            Tente novamente mais tarde."
            actionButtons={[{
              label: "Voltar ao menu",
              type: "danger",
              action: () => navigation.replace("/")
            }]}
          />
        )
      }
    })()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!authContext.signedIn) {
      navigation.replace("/acesso-restrito/login")
    }
  }, [authContext.signedIn, navigation])

  return (
    feedback
      ? feedback
      : (
        <Switch>
          <Route path="/acesso-restrito/dashboard/orfanatos" component={Orphanages} />
          <Route path="/acesso-restrito/dashboard/orfanatos/editar" />
          <Redirect to="/acesso-restrito/dashboard/orfanatos" />
        </Switch>
      )
  )
}

export default Dashboard