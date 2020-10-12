import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

// Pages
import Landing from 'pages/Landing'
import OrphanageMap from 'pages/OrphanageMap'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/orfanatos" exact component={OrphanageMap} />
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default AppRoutes