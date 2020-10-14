import React from 'react'
import { FiArrowLeft } from "react-icons/fi"
import mapMarkerImg from 'assets/images/happy-face-logo.svg'
import { useHistory } from 'react-router-dom'

// Styles
import 'assets/styles/components/sidebar.css'

function Sidebar() {
    const { goBack } = useHistory()
    
    return (
        <aside className="sidebar">
            <img src={mapMarkerImg} alt="Happy" />

            <footer>
                <button type="button" onClick={goBack}>
                    <FiArrowLeft size={24} color="#FFF" />
                </button>
            </footer>
        </aside>
    )
}

export default Sidebar