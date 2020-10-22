import React, { useState } from "react"
import { FiArrowLeft, FiMapPin, FiAlertCircle, FiPower } from "react-icons/fi"
import mapMarkerImg from "assets/images/happy-face-logo.svg"
import { useHistory } from "react-router-dom"
import useAuth from "contexts/auth"

// Styles
import "assets/styles/components/sidebar.css"

interface SidebarProps {
  showNavigation?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ showNavigation = false }) => {
  const { goBack, replace } = useHistory()
  const [buttonsSelectionState, setButtonsSelectionState] = useState(["selected", ""])
  const authContext = useAuth()

  function handleButtonClick(btn: 0 | 1) {
    if (btn === 0) {
      setButtonsSelectionState(["selected", ""])
      replace("/acesso-restrito/dashboard/orfanatos/cadastrados")
    } else {
      setButtonsSelectionState(["", "selected"])
      replace("/acesso-restrito/dashboard/orfanatos/pendentes")
    }
  }

  return (
    <aside className="sidebar">
      <img src={mapMarkerImg} alt="Happy" />

      {
        showNavigation && (
          <nav>
            <button
              onClick={() => handleButtonClick(0)}
              className={`nav-button ${buttonsSelectionState[0]}`}
            >
              <FiMapPin 
                size={24} 
                color={
                  buttonsSelectionState[0] === "selected" 
                    ? "#0089A5"
                    : "#FFFFFF"
                }
              />
            </button>

            <button
              onClick={() => handleButtonClick(1)}
              className={`nav-button ${buttonsSelectionState[1]}`}
            >
              <FiAlertCircle 
                size={24} 
                color={
                  buttonsSelectionState[1] === "selected" 
                    ? "#0089A5"
                    : "#FFFFFF"
                }
              />
            </button>
          </nav>
        )
      }

      <footer>
        {
          !showNavigation
            ? (
              <button type="button" onClick={goBack}>
                <FiArrowLeft size={24} color="#FFFFFF" />
              </button>
            ) : (
              <button onClick={authContext.signout} className="nav-button">
                <FiPower size={24} color="#FFFFFF" />
              </button>
            )
        }
      </footer>
    </aside>
  )
}

export default Sidebar