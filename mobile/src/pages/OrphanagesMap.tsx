import React, { useEffect, useState } from "react"
import { View, Text, Image, Dimensions, StyleSheet, ActivityIndicator } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps"
import * as Location from "expo-location"
import { Entypo } from "@expo/vector-icons"
import { RectButton } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

import HappyFaceLogo from "assets/images/happy-face-logo.png"

function OrphanagesMap() {
  const [location, setLocation] = useState<[number, number]>([0, 0])
  const navigation = useNavigation()

  useEffect(() => {
    (async function () {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== "granted") {
        setLocation([-3.1189334, -60.0207567])
      } else {
        const loc = await Location.getCurrentPositionAsync({})
        const coords: [number, number] = [loc.coords.latitude, loc.coords.longitude]
        setLocation(coords)
      }
    })()
  }, [])

  return (
    <View>
      {
        location[0] !== 0 && location[1] !== 0
          ? (
            <>
              <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location[0],
                  longitude: location[1],
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008
                }}
                style={styles.mapStyle}
              >
                <Marker
                  coordinate={{
                    latitude: location[0],
                    longitude: location[1]
                  }}
                  calloutAnchor={{
                    x: 0.5,
                    y: -0.1
                  }}
                >
                  <Image
                    source={HappyFaceLogo}
                    style={{ width: 60, height: 60 }}
                    resizeMode="contain"
                  />
                  <Callout tooltip onPress={() => navigation.navigate("OrphanageDetails")}>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutText}>
                        Lar das Meninas
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              </MapView>

              <View style={styles.footer}>
                <Text style={styles.footerText}>2 orfanatos encontrados</Text>
                <RectButton style={styles.addBtn} onPress={() => navigation.navigate("SelectMapPosition")}>
                  <Entypo name="plus" size={24} color="#FFFFFF" />
                </RectButton>
              </View>
            </>
          ) : (
            <View style={styles.loadingMapContainer}>
              <Image style={styles.loadingMapLogo} source={HappyFaceLogo} />
              <Text style={styles.loadingMapText}>Carregando mapa</Text>
              <ActivityIndicator size={80} color="#FFFFFF" />
            </View>
          )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  loadingMapContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00C7C7",
  },

  loadingMapLogo: {
    marginBottom: 20
  },

  loadingMapText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 20
  },

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  calloutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    borderColor: "rgba(0,137,165, 0.4)",
    borderWidth: 1
  },

  calloutText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#0089A5"
  },

  footer: {
    width: 327,
    height: 56,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 10,
    borderRadius: 20,
    paddingLeft: 25,
    elevation: 3
  },

  footerText: {
    color: "#8FA7B3",
    fontSize: 15,
    fontFamily: "Nunito_700Bold"
  },

  addBtn: {
    width: 56,
    height: 56,
    backgroundColor: "#15C3D6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default OrphanagesMap