import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

// Images
import appLogo from 'assets/images/logo.svg'

// Styles
import 'assets/styles/pages/landing.css'

function Landing() {
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <div className="logo-location-container">
          <img src={appLogo} alt="Logo Happy" />
          <div className="location">
            <span>Manaus</span>
            <strong>Amazonas</strong>
          </div>
        </div>

        <main>
          <div id="main-heading">
            <h1>Leve felicidade para o mundo</h1>
            <p>Visite orfanatos e mude o dia de muitas crianças.</p>
          </div>

          <button className="strict-access-btn">Acesso Restrito</button>
        </main>

        <Link to="/orfanatos" className="enter-app">
          <FiArrowRight size={32} color="#8D734B" />
        </Link>
      </div>
    </div>
  )
}

export default Landing