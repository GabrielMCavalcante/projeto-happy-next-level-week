import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

// Pages
import Landing from 'pages/Landing'
import OrphanageMap from 'pages/OrphanageMap'
import Orphanage from 'pages/Orphanage'
import CreateOrphanage from 'pages/CreateOrphanage'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/orfanatos" exact component={OrphanageMap} />
                <Route path="/orfanatos/criar" exact component={CreateOrphanage} />
                <Route path="/orfanatos/:id" exact component={Orphanage} />
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default AppRoutes