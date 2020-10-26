import React from "react"
import { View, Text, Image, StyleSheet, Dimensions } from "react-native"
import { RectButton } from "react-native-gesture-handler"

// Images
import success from "assets/images/success-feedback.png"
import error from "assets/images/error-feedback.png"


interface ActionButton {
  label: string,
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
    <View style={[styles.feedbackContainer, styles[type]]}>
      <Image
        source={type === "success" ? success : error}
        resizeMode="contain"
      />

      <View style={styles.feedbackTextContainer}>
        <Text style={styles.feedbackTextTitle}>{title}</Text>
        <Text style={styles.feedbackTextSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        {
          actionButtons.map((button, i) => (
            <RectButton
              key={i}
              style={[
                styles.actionButton,
                type === "success"
                  ? styles.actionButtonSuccess
                  : styles.actionButtonError,
                i > 0 && styles.actionButtonSpaced
              ]}
              onPress={button.action}
            >
              <Text style={styles.actionButtonText}>{button.label}</Text>
            </RectButton>
          ))
        }
      </View>
    </View>
  )
}

export default Feedback

const styles = StyleSheet.create({
  feedbackContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },

  success: {
    backgroundColor: "#39CC83"
  },

  error: {
    backgroundColor: "#FF669D"
  },

  feedbackTextContainer: {
    justifyContent: "center",
    alignItems: "center"
  },

  feedbackTextTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 40,
    textAlign: "center",
    color: "#FFFFFF"
  },

  feedbackTextSubtitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    color: "#FFFFFF"
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 120,
    height: 56
  },

  actionButtonSuccess: {
    backgroundColor: "#19C06D"
  },

  actionButtonError: {
    backgroundColor: "#D6487B"
  },

  actionButtonSpaced: {
    marginLeft: 10
  },

  actionButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: "#FFFFFF"
  }
})