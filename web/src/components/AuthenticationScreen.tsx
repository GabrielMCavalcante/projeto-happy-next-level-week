import React from "react"
import { FiArrowLeft } from "react-icons/fi"
import { useHistory } from "react-router-dom"

// Images
import LogoTitleImg from "assets/images/logo-title.svg"

// Styles
import "assets/styles/components/authenticationScreen.css"

interface AuthenticationScreenProps {
  type?: "normal" | "inverted",
  returnBtn?: boolean,
  returnTo?: string,
  formElement: JSX.Element
}

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = (props) => {

  const { type = "normal", returnBtn = true, formElement, returnTo } = props
  const { replace: navigate } = useHistory()

  return (
    <div className={`authentication-screen ${type}`}>
      <div className="logo-container">
        <div className="logo-container-content">
          <img src={LogoTitleImg} alt="Logo Happy" />

          <strong>Manaus</strong>
          <span>Amazonas</span>
        </div>
      </div>

      <main>
        {
          returnBtn && (
            <button onClick={() => navigate(returnTo!)} className="return-btn">
              <FiArrowLeft size={24} color="#11AEC5" />
            </button>
          )
        }

        { formElement }
      </main>
    </div>
  )
}

export default AuthenticationScreen