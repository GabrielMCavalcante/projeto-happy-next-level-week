import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

// Images
import appLogo from 'assets/images/logo.svg'
import landingKids from 'assets/images/landing-kids.svg'

// Styles
import 'assets/styles/pages/landing.css'

function App() {
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={appLogo} alt="Logo Happy" />

        <main>
          <div id="main-heading">
            <h1>Leve felicidade para o mundo</h1>
            <p>Visite orfanatos e mude o dia de muitas crianças.</p>
          </div>

          <div className="location">
            <strong>Manaus</strong>
            <span>Amazonas</span>
          </div>
        </main>

        <a href="go" className="enter-app">
          <FiArrowRight size={32} color="#8D734B" />
        </a>
      </div>
    </div>
  )
}

export default App