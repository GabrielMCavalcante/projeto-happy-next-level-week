import React, { useEffect, useState } from "react"
import { Image, View, ScrollView, Text, StyleSheet, Dimensions, Linking, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { useRoute, useNavigation, NavigationState } from "@react-navigation/native"
import MapView, { Marker } from "react-native-maps"
import { Feather, FontAwesome } from "@expo/vector-icons"
import { BorderlessButton, RectButton } from "react-native-gesture-handler"
import api from "services/api"

import happyFaceLogo from "assets/images/happy-face-logo.png"
import Feedback from "components/Feedback"

interface OrphanageImage {
  id: number,
  url: string
}

interface Orphanage {
  name: string,
  latitude: number,
  longitude: number,
  about: string,
  instructions: string,
  opening_hours: string,
  open_on_weekends: boolean
}

export default function OrphanageDetails() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const [orphanage, setOrphanage] = useState<Orphanage>()
  const [images, setImages] = useState<OrphanageImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    (async function () {
      const id = (params! as { orphanageId: number }).orphanageId
      try {
        const response = await api.get(`/orphanages/${id}`)
        const data = response.data.result

        setOrphanage(data)
        setImages([...data.images])
      } catch (err) {
        hideHeader()
        setError(true)
      }
    })()
  }, [])

  function hideHeader() {
    navigation.setOptions({
      headerShown: false
    })
  }

  function onScroll(event?: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!event) return

    const xOffset = event.nativeEvent.contentOffset.x + 10
    const currentPage = Math.floor(xOffset / Dimensions.get("window").width)
    setCurrentIndex(currentPage)
  }

  return (
    error
      ? (
        <Feedback
          type="error"
          title="Ahhh!"
          subtitle="Ocorreu um erro ao carregar as informações do orfanato. 
          Por favor, tente novamente mais tarde."
          actionButtons={[{
            label: "Voltar ao mapa",
            action: () => navigation.navigate("OrphanagesMap")
          }]}
        />
      )
      : (
        <ScrollView style={styles.container}>
          {
            orphanage && (
              <>
                <View style={styles.imagesContainer}>
                  <ScrollView onScroll={onScroll} horizontal pagingEnabled>
                    {
                      images.map(image => (
                        <Image
                          key={image.id}
                          style={styles.image}
                          source={{ uri: image.url }}
                        />
                      ))
                    }
                  </ScrollView>

                  <View style={styles.imagesPaginationContainer}>
                    {
                      images.map((_, i) => (
                        <BorderlessButton
                          key={i}
                          style={[
                            styles.imagesPaginationDot,
                            i > 0 && styles.spacedPaginationDot,
                            i === currentIndex
                            && styles.selectedPaginationDot
                          ]}
                        />
                      ))
                    }
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.title}>{orphanage.name}</Text>
                  <Text style={styles.description}>{orphanage.about}</Text>

                  <View style={styles.mapContainer}>
                    <MapView
                      initialRegion={{
                        latitude: orphanage.latitude,
                        longitude: orphanage.longitude,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.008,
                      }}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      scrollEnabled={false}
                      rotateEnabled={false}
                      style={styles.mapStyle}
                    >
                      <Marker
                        coordinate={{
                          latitude: orphanage.latitude,
                          longitude: orphanage.longitude
                        }}
                      >
                        <Image
                          source={happyFaceLogo}
                          style={{ width: 60, height: 60 }}
                          resizeMode="contain"
                        />
                      </Marker>
                    </MapView>

                    <View style={styles.routesContainer}>
                      <BorderlessButton onPress={() => {
                        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`)
                      }}>
                        <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
                      </BorderlessButton>
                    </View>
                  </View>

                  <View style={styles.separator} />

                  <Text style={styles.title}>Instruções para visita</Text>
                  <Text style={styles.description}>{orphanage.instructions}</Text>

                  <View style={styles.scheduleContainer}>
                    <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
                      <Feather name="clock" size={40} color="#2AB5D1" />
                      <Text
                        style={[
                          styles.scheduleText,
                          styles.scheduleTextBlue
                        ]}
                      >{orphanage.opening_hours}</Text>
                    </View>
                    <View
                      style={[
                        styles.scheduleItem,
                        orphanage.open_on_weekends
                          ? styles.scheduleItemGreen
                          : styles.scheduleItemRed
                      ]}
                    >
                      <Feather
                        name="info"
                        size={40}
                        color={
                          orphanage.open_on_weekends
                            ? "#39CC83"
                            : "#FF669D"
                        }
                      />
                      <Text
                        style={[
                          styles.scheduleText,
                          orphanage.open_on_weekends
                            ? styles.scheduleTextGreen
                            : styles.scheduleTextRed
                        ]}
                      >{
                          orphanage.open_on_weekends
                            ? "Atendemos fim de semana"
                            : "Não atendemos fim de semana"
                        }</Text>
                    </View>
                  </View>

                  <RectButton style={styles.contactButton} onPress={() => { }}>
                    <FontAwesome name="whatsapp" size={24} color="#FFF" />
                    <Text style={styles.contactButtonText}>Entrar em contato</Text>
                  </RectButton>
                </View>
              </>
            )
          }
        </ScrollView >
      )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get("window").width,
    height: 240,
    resizeMode: "cover",
  },

  imagesPaginationContainer: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: "absolute",
    bottom: 10,
    alignSelf: "center"
  },

  imagesPaginationDot: {
    width: 10,
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 4
  },

  spacedPaginationDot: {
    marginLeft: 6
  },

  selectedPaginationDot: {
    backgroundColor: "#FFD152",
    width: 20
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: "#4D6F80",
    fontSize: 30,
    fontFamily: "Nunito_700Bold",
  },

  description: {
    fontFamily: "Nunito_600SemiBold",
    color: "#5c8599",
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "#B3DAE2",
    marginTop: 40,
    backgroundColor: "#E6F7FB",
  },

  mapStyle: {
    width: "100%",
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  routesText: {
    fontFamily: "Nunito_700Bold",
    color: "#0089a5"
  },

  separator: {
    height: 0.8,
    width: "100%",
    backgroundColor: "#D3E2E6",
    marginVertical: 40,
  },

  scheduleContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  scheduleItem: {
    width: "48%",
    padding: 20,
  },

  scheduleItemBlue: {
    backgroundColor: "#E6F7FB",
    borderWidth: 1,
    borderColor: "#B3DAE2",
    borderRadius: 20,
  },

  scheduleItemGreen: {
    backgroundColor: "#EDFFF6",
    borderWidth: 1,
    borderColor: "#A1E9C5",
    borderRadius: 20,
  },

  scheduleItemRed: {
    backgroundColor: "#FCF0F4",
    borderWidth: 1,
    borderColor: "#FFBCD4",
    borderRadius: 20,
  },

  scheduleText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },

  scheduleTextBlue: {
    color: "#5C8599"
  },

  scheduleTextGreen: {
    color: "#37C77F"
  },

  scheduleTextRed: {
    color: "#FF669D"
  },

  contactButton: {
    backgroundColor: "#3CDC8C",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    marginTop: 40,
  },

  contactButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    color: "#FFF",
    fontSize: 16,
    marginLeft: 16,
  }
})