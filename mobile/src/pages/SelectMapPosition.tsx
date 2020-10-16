import React, { useState } from "react"
import { View, StyleSheet, Dimensions, Text, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { RectButton } from "react-native-gesture-handler"
import MapView, { Marker } from "react-native-maps"

import happyFaceLogo from "assets/images/happy-face-logo.png"

export default function SelectMapPosition() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const [position, setPosition] = useState<[number, number]>([0, 0])

  function handleNextStep() {
    navigation.navigate("OrphanageData", {
      orphanageCoords: {
        latitude: position[0],
        longitude: position[1]
      }
    })
  }

  return (
    <View style={styles.container}>
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

      <RectButton style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>Próximo</Text>
      </RectButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
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
    color: "#FFF",
  }
})