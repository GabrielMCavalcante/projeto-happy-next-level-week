import useDashboard from "contexts/dashboard"
import React, { useEffect } from "react"
import { Route, Redirect, Switch } from "react-router-dom"
import Orphanages from "./Orphanages"

function Dashboard() {
  const dashboardContext = useDashboard()

  useEffect(() => {
    (async function () {
      await dashboardContext.fetchOrphanages()
    })()
  }, []) // eslint-disable-line

  return (
    <>
      <Switch>
        <Route path="/acesso-restrito/dashboard/orfanatos" component={Orphanages}/>
        <Route path="/acesso-restrito/dashboard/orfanatos/editar"/>
        <Redirect to="/acesso-restrito/dashboard/orfanatos"/>
      </Switch>
    </>
  )
}

export default Dashboard