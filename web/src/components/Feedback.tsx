import React from 'react'

// Images
import FeedbackSuccessImg from "assets/images/feedback-success.svg"
import FeedbackErrorImg from "assets/images/feedback-error.svg"

// Styles
import "assets/styles/components/feedback.css"

interface ActionButton {
  type: "success" | "danger",
  label: string | JSX.Element,
  action: () => void
}

interface FeedbackProps {
  type: "success" | "error",
  title: string,
  subtitle: string,
  actionButtons: ActionButton[]
}

const Feedback: React.FC<FeedbackProps> = (props) => {
  const { type, title, subtitle, actionButtons } = props

  return (
    <div className={`feedback ${type}`}>
      <div className="feedback-content">
        <main>
          <hgroup>
            <h1>{title}</h1>
            <h3>{subtitle}</h3>
          </hgroup>

          <div className="action-buttons-container">
            {
              actionButtons.map((button, i) => (
                <button
                  key={i}
                  onClick={button.action}
                  className={`action-btn ${button.type}`}
                >
                  {button.label}
                </button>
              ))
            }
          </div>
        </main>

        <img
          src={type === "success" ? FeedbackSuccessImg : FeedbackErrorImg}
          alt="Feedback"
        />
      </div>
    </div>
  )
}

export default Feedback