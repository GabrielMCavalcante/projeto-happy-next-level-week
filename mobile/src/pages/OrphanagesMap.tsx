import React, { useCallback, useState } from "react"
import { View, Text, Image, Dimensions, StyleSheet, ActivityIndicator } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps"
import * as Location from "expo-location"
import { Entypo } from "@expo/vector-icons"
import { RectButton } from "react-native-gesture-handler"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

// Services
import api from "services/api"

// Images
import HappyFaceLogo from "assets/images/happy-face-logo.png"

interface OrphanageMarker {
  name: string,
  id: number,
  latitude: number,
  longitude: number
}

function OrphanagesMap() {
  const [location, setLocation] = useState<[number, number]>([-3.1189334, -60.0207567])
  const [orphanages, setOrphanages] = useState<OrphanageMarker[]>([])
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)

  useFocusEffect(useCallback(() => {
    (async function () {
      const response = await api.get("orphanages")
      const data = response.data.result
      setOrphanages([...data])

      const { status } = await Location.requestPermissionsAsync()
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({})
        const coords: [number, number] = [loc.coords.latitude, loc.coords.longitude]
        setLocation(coords)
      }

      setLoading(false)
    })()
  }, []))

  function handleNavigateToOrphanageDetails(orphanageId: number) {
    navigation.navigate("OrphanageDetails", { orphanageId })
  }

  return (
    <View>
      {
        !loading
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
                {
                  orphanages.map(orphanage => (
                    <Marker
                      key={orphanage.id}
                      coordinate={{
                        latitude: orphanage.latitude,
                        longitude: orphanage.longitude
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
                      <Callout
                        tooltip
                        onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                        <View style={styles.calloutContainer}>
                          <Text style={styles.calloutText}>
                            {orphanage.name}
                          </Text>
                        </View>
                      </Callout>
                    </Marker>
                  ))
                }
              </MapView>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {orphanages.length}{" "}
                  orfanato{orphanages.length !== 1 ? "s" : ""}{" "}
                  encontrado{orphanages.length !== 1 ? "s" : ""}
                </Text>
                <RectButton
                  style={styles.addBtn}
                  onPress={() => navigation.navigate("SelectMapPosition", {
                    userCoords: {
                      latitude: location[0],
                      longitude: location[1]
                    }
                  })}
                >
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
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
    flex: 1
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