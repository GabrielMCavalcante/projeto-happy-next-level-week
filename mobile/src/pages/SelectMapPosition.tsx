import React, { useCallback, useState } from "react"
import { View, StyleSheet, Dimensions, Text, Image } from "react-native"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import { RectButton } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-community/async-storage"
import MapView, { Marker } from "react-native-maps"

import happyFaceLogo from "assets/images/happy-face-logo.png"
import touchIndicator from "assets/images/touch-indicator.png"

export default function SelectMapPosition() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [showHelp, setShowHelp] = useState(false)

  function handleNextStep() {
    navigation.navigate("OrphanageInfo", {
      orphanageCoords: {
        latitude: position[0],
        longitude: position[1]
      }
    })
  }

  useFocusEffect(useCallback(() => {
    (async function () {
      const help = await AsyncStorage.getItem("happy:app:map-help")

      if (!help) {
        setShowHelp(true)
      }
    })()
  }, []))

  async function onHelpDismiss() {
    await AsyncStorage.setItem("happy:app:map-help", "true")
    setShowHelp(false)
  }

  return (
    <View style={styles.container}>
      {
        showHelp
        && (
          <View onTouchEnd={onHelpDismiss} style={styles.helpContainer}>
            <Image source={touchIndicator} resizeMode="contain" />
            <Text style={styles.helpText}>
              Toque no mapa para adicionar um orfanato
                </Text>
          </View>
        )
      }
      <MapView
        initialRegion={{
          latitude: (params as any).userCoords.latitude,
          longitude: (params as any).userCoords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={event => {
          const coords = event.nativeEvent.coordinate
          setPosition([coords.latitude, coords.longitude])
        }}
      >
        <Marker
          coordinate={{ latitude: position[0], longitude: position[1] }}
        >
          <Image
            source={happyFaceLogo}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      {
        position[0] !== 0 && (
          <RectButton
            style={styles.nextButton}
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>Próximo</Text>
          </RectButton>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },

  helpContainer: {
    position: "absolute",
    backgroundColor: "#15B6D699",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: "100%",
    flex: 1,
    zIndex: 999
  },

  helpText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    maxWidth: 250,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20
  },

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  nextButton: {
    backgroundColor: "#15c3d6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 56,

    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  }
})