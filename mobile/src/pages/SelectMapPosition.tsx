import React from "react"
import { View, StyleSheet, Dimensions, Text, Image } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { RectButton } from "react-native-gesture-handler"
import MapView, { Marker } from "react-native-maps"

import happyFaceLogo from "assets/images/happy-face-logo.png"

export default function SelectMapPosition() {
  const navigation = useNavigation()

  function handleNextStep() {
    navigation.navigate("OrphanageData")
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: -27.2092052,
          longitude: -49.6401092,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{ latitude: -27.2092052, longitude: -49.6401092 }}
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