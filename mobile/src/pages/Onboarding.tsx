import React from "react"
import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions } from "react-native"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { RectButton } from "react-native-gesture-handler"

import happyWorld from "assets/images/happy-planet.png"
import happyKids from "assets/images/happy-kids.png"

interface OnboardingScreenProps {
  image: ImageSourcePropType,
  title: string,
  subtitle?: string,
  position: "first" | "last",
  onDismiss?: () => void 
}

interface OnboardingProps { 
  onDismiss: () => void 
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = (props) => {
  const { image, title, subtitle, position, onDismiss } = props
  const navigation = useNavigation()

  return (
    <View style={styles.onboardingScreenContainer}>
      <View style={styles.onboardingScreenContent}>
        <Image style={styles.image} source={image} resizeMode="contain"/>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.onboardingScreenControls}>
        <View style={styles.onboardingScreenControlsDots}>
          <View
            style={[styles.dot,
              position === "first"
                ? styles.dotActive
                : styles.dotUnactive
            ]}
          />
          <View
            style={[styles.dot,
              position === "first"
                ? styles.dotUnactive
                : styles.dotActive
            ]}
          />
        </View>

        <RectButton 
          style={styles.onActionBtn} 
          onPress={() => {
            position === "first"
              ? navigation.navigate("Onboarding2")
              : onDismiss!()
          }}
        >
          <Ionicons name="md-arrow-forward" size={24} color="#E3A800"/>
        </RectButton>
      </View>
    </View>
  )
}

const Onboarding: React.FC<OnboardingProps> = ({ onDismiss }) => {
  const { Navigator, Screen } = createStackNavigator()

  const screens: OnboardingScreenProps[] = [
    {
      image: happyWorld,
      title: "Leve felicidade para o mundo",
      subtitle: "Visite orfanatos e mude o dia dessas crianças.",
      position: "first"
    },
    {
      image: happyKids,
      title: "Escolha um orfanato no mapa e faça uma visita",
      position: "last"
    }
  ]

  return (
    <NavigationContainer>
      <Navigator headerMode="none">
        <Screen name="Onboarding1">
          {
            () => (
              <OnboardingScreen 
                image={screens[0].image}
                title={screens[0].title}
                subtitle={screens[0].subtitle}
                position={screens[0].position}
              />
            )
          }  
        </Screen>
        <Screen name="Onboarding2">
          {
            () => (
              <OnboardingScreen 
                image={screens[1].image}
                title={screens[1].title}
                position={screens[1].position}
                onDismiss={onDismiss}
              />
            )
          }  
        </Screen>
      </Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  onboardingScreenContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#EBF2F5"
  },

  onboardingScreenContent: {
    padding: 15,
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  image: {
    width: 300,
    height: 340,
    marginBottom: 40
  },

  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 40,
    color: "#00C7C7",
    lineHeight: 43,
    maxWidth: 300
  },

  subtitle: {
    marginTop: 10,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 20,
    color: "#5C8599",
    maxWidth: 300
  },

  onboardingScreenControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 10
  },

  onboardingScreenControlsDots: {
    flexDirection: "row",
    width: 20,
    justifyContent: "space-between",
    alignItems: "center"
  },

  dot: {
    width: 8,
    height: 4,
    borderRadius: 4
  },

  dotActive: {
    backgroundColor: "#FFD666"
  },

  dotUnactive: {
    backgroundColor: "#F2DAAA"
  },

  onActionBtn: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#F8ECD3",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default Onboarding