import { StatusBar } from "expo-status-bar"
import { AppLoading } from "expo"
import React, { useState, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold
} from "@expo-google-fonts/nunito"

// Routes
import Routes from "routes"
import Onboarding from "pages/Onboarding"

export default function App() {
  const [route, setRoute] = useState(Routes)

  function dismissOnboarding() {
    AsyncStorage.setItem("happy:app:alreadyopened", "true")
      .then(() => setRoute(Routes))
  }

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  })

  useEffect(() => {
    (async function () {
      if (fontsLoaded) {
        const check = await AsyncStorage.getItem("happy:app:alreadyopened")
        if (!check || check === "false") {
          setRoute(<Onboarding onDismiss={dismissOnboarding} />)
        } else {
          await AsyncStorage.setItem("happy:app:alreadyopened", "false")
        }
      }
    })()
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" hidden />
        { route}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
