import React from "react"
import { FiArrowLeft } from "react-icons/fi"

// Images
import LogoTitleImg from "assets/images/logo-title.svg"

// Styles
import "assets/styles/components/authenticationScreen.css"

interface AuthenticationScreenProps {
  style?: "normal" | "inverted",
  returnBtn?: boolean,
  formElement: JSX.Element
}

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = (props) => {

  const { style = "normal", returnBtn = true, formElement } = props

  return (
    <div className={`authentication-screen ${style}`}>
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
            <button className="return-btn">
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