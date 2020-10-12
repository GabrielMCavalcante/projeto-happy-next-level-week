import React from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'

// Images
import happyFace from 'assets/images/happy-face-logo.svg'

// Styles
import 'assets/styles/pages/orphanageMap.css'

function OrphanageMap() {
    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={happyFace} alt="Happy Face Logo" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Manaus</strong>
                    <span>Amazonas</span>
                </footer>
            </aside>

            <Link to="/" id="create-orphanage-btn">
                <FiPlus size={32} color="#FFFFFF"/>
            </Link>
        </div>
    )
}

export default OrphanageMap