import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  Switch,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native"
import { Entypo } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { RectButton } from "react-native-gesture-handler"
import { useRoute, useNavigation } from "@react-navigation/native"
import api from "services/api"

export default function OrphanageData() {
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [instructions, setInstructions] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [opening_hours, setOpeningHours] = useState("")
  const [open_on_weekends, setOpenOnWeekends] = useState(false)

  const navigation = useNavigation()
  const { params } = useRoute()

  useEffect(() => {
    (async function () {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, [])

  async function handleCreateOrphanage() {
    const orphanageCoords = (params as any).orphanageCoords

    const formData = new FormData()

    formData.append("name", name)
    formData.append("about", about)
    formData.append("instructions", instructions)
    formData.append("opening_hours", opening_hours)
    formData.append("open_on_weekends", String(open_on_weekends))
    formData.append("latitude", String(orphanageCoords.latitude))
    formData.append("longitude", String(orphanageCoords.longitude))

    const date = Date.now()
    images.forEach((image, index) => {
      formData.append("images", {
        name: `${date}imagem${index}.jpg`,
        type: "image/jpg",
        uri: image
      } as any)
    })

    await api.post("/orphanages", formData)
    await alert("Orfanato criado com sucesso!")
    navigation.navigate("OrphanagesMap")
  }

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

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.imagesContainer}>
        {
          images.map((image, i) => (
            <Image key={i} style={styles.selectedImage} source={{ uri: image }} />
          ))
        }

        <TouchableOpacity style={styles.imagesInput} onPress={handleImageSelection}>
          <Entypo name="plus" size={24} color="#15B6D6" />
        </TouchableOpacity>
      </View>

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

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
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
    alignItems: "center",
    width: Dimensions.get("window").width,
    marginBottom: 10
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

  nextButton: {
    backgroundColor: "#15c3d6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFF",
  }
})