import { StatusBar } from 'expo-status-bar'
import { AppLoading } from 'expo'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold
} from '@expo-google-fonts/nunito'

import OrphanagesMap from 'pages/OrphanagesMap'

export default function App() {
  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  })

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" hidden/>
        <OrphanagesMap />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
