import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  Image,
  Switch,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native"
import { DotIndicator } from "react-native-indicators"
import { Entypo } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { RectButton } from "react-native-gesture-handler"
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import api from "services/api"
import Feedback from "components/Feedback"
import Header from "components/Header"

interface LatLng {
  latitude: number,
  longitude: number
}

interface OrphanageDataProps {
  coords: LatLng
}

interface OrphanageDataType {
  name: string,
  about: string,
  whatsapp: string,
  images: string[],
  latitude: number,
  longitude: number
}

const OrphanageData: React.FC<OrphanageDataProps> = ({ coords }) => {
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [images, setImages] = useState<string[]>([])

  const [formValid, setFormValid] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    if (!name || !about || !whatsapp || images.length === 0) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [name, about, whatsapp, images])

  async function handleImageSelection() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })

    if (!result.cancelled) {
      setImages([...images, (result as any).uri])
    }
  }

  function handleNextStep() {
    const orphanageData = {
      name,
      about,
      whatsapp,
      images,
      latitude: coords.latitude,
      longitude: coords.longitude
    }

    navigation.navigate("OrphanageVisiting", orphanageData)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={text => setAbout(text)}
      />

      <Text style={styles.label}>Número de whatsapp</Text>
      <TextInput
        style={styles.input}
        value={whatsapp}
        onChangeText={text => setWhatsapp(text)}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.imagesContainer}>
        {
          images.map((image, i) => (
            <View key={i} style={styles.imageCard}>
              <Image style={styles.selectedImage} source={{ uri: image }} />
              <Entypo
                onPress={() => setImages(images.filter((_, index) => index !== i))}
                style={styles.removeImgBtn}
                name="cross"
                size={30}
                color="#FF669D"
              />
            </View>
          ))
        }

        <TouchableOpacity style={styles.imagesInput} onPress={handleImageSelection}>
          <Entypo name="plus" size={24} color="#15B6D6" />
        </TouchableOpacity>
      </View>

      <RectButton
        enabled={formValid}
        style={[styles.button, styles.nextButton, !formValid && styles.buttonDisabled]}
        onPress={handleNextStep}
      >
        <Text style={styles.buttonText}>Próximo</Text>
      </RectButton>
    </ScrollView>
  )
}

function OrphanageVisiting() {
  const [instructions, setInstructions] = useState("")
  const [opening_hours, setOpeningHours] = useState("")
  const [open_on_weekends, setOpenOnWeekends] = useState(false)
  const [requestStatus, setRequestStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [formValid, setFormValid] = useState(false)

  const navigation = useNavigation()
  const { params } = useRoute()

  useEffect(() => {
    if (!instructions || !opening_hours) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [instructions, opening_hours])

  function hideHeader() {
    navigation.setOptions({
      headerShown: false
    })
  }

  async function handleCreateOrphanage() {
    const formData = new FormData()
    const orphanageData = params as OrphanageDataType

    formData.append("name", orphanageData.name)
    formData.append("about", orphanageData.about)
    formData.append("whatsapp", orphanageData.whatsapp)
    formData.append("instructions", instructions)
    formData.append("opening_hours", opening_hours)
    formData.append("open_on_weekends", String(open_on_weekends))
    formData.append("latitude", String(orphanageData.latitude))
    formData.append("longitude", String(orphanageData.longitude))

    const date = Date.now()
    orphanageData.images.forEach((image, index) => {
      formData.append("images", {
        name: `${date}imagem${index}.jpg`,
        type: "image/jpg",
        uri: image
      } as any)
    })

    try {
      setLoading(true)

      await api.post("/orphanages", formData)

      hideHeader()
      setRequestStatus("success")
      setLoading(false)
    } catch (err) {
      hideHeader()
      setRequestStatus("error")
      setLoading(false)
    }
  }

  return (
    requestStatus !== ""
      ? (
        requestStatus === "success"
          ? (
            <Feedback
              type="success"
              title="Ebaaa!"
              subtitle="O cadastro deu certo e foi enviado ao
              administrador para ser aprovado. Agora é só esperar :)"
              actionButtons={[
                {
                  label: "Voltar para o mapa",
                  action: () => navigation.navigate("OrphanagesMap")
                }
              ]}
            />
          ) : (
            <Feedback
              type="error"
              title="Ahhh!"
              subtitle="Ocorreu algum erro ao processar o cadastro.
              Por favor, tente novamente mais tarde."
              actionButtons={[
                {
                  label: "Voltar para o mapa",
                  action: () => navigation.navigate("OrphanagesMap")
                }
              ]}
            />
          )
      )
      : (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
          <Text style={styles.title}>Visitação</Text>

          <Text style={styles.label}>Instruções</Text>
          <TextInput
            style={[styles.input, { height: 110 }]}
            multiline
            value={instructions}
            onChangeText={text => setInstructions(text)}
          />

          <Text style={styles.label}>Horario de visitas</Text>
          <TextInput
            style={styles.input}
            value={opening_hours}
            onChangeText={text => setOpeningHours(text)}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Atende final de semana?</Text>
            <Switch
              thumbColor="#fff"
              trackColor={{ false: "#ccc", true: "#39CC83" }}
              value={open_on_weekends}
              onValueChange={() => setOpenOnWeekends(!open_on_weekends)}
            />
          </View>

          <RectButton
            enabled={formValid}
            style={[styles.button, styles.confirmButton, !formValid && styles.buttonDisabled]}
            onPress={handleCreateOrphanage}
          >
            {
              loading
                ? <DotIndicator color="#FFFFFF" size={10} count={3} />
                : <Text style={styles.buttonText}>Cadastrar</Text>
            }
          </RectButton>
        </ScrollView>
      )
  )
}

export default function OrphanageInfo() {
  const { Navigator, Screen } = createStackNavigator()

  const coords = (useRoute() as any).params.orphanageCoords

  useFocusEffect(useCallback(() => {
    (async function () {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, []))

  return (
    <Navigator initialRouteName="OrphanageData">
      <Screen
        name="OrphanageData"
        options={{
          headerShown: true,
          header: () => <Header title="Adicione um orfanato" />
        }}
      >
        {() => <OrphanageData coords={coords} />}
      </Screen>
      <Screen
        name="OrphanageVisiting"
        component={OrphanageVisiting}
        options={{
          headerShown: true,
          header: () => <Header title="Adicione um orfanato" />
        }}
      />
    </Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: "#5c8599",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: "#D3E2E6"
  },

  label: {
    color: "#8fa7b3",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: "#8fa7b3",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#d3e2e6",
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: "top",
  },

  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width,
    marginBottom: 10
  },

  imageCard: {
    position: "relative"
  },

  removeImgBtn: {
    position: "absolute",
    top: 0,
    right: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#FFFFFFDD",
    width: 35,
    height: 35,
    textAlign: "center"
  },

  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10
  },

  imagesInput: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
    borderColor: "#96D2F0",
    borderWidth: 1.4,
    borderRadius: 20,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  button: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.5
  },

  buttonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFF",
  },

  nextButton: {
    backgroundColor: "#15c3d6"
  },

  confirmButton: {
    backgroundColor: "#3CDC8C"
  }
})