import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons, Entypo } from "@expo/vector-icons"
import { BorderlessButton } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

interface HeaderProps {
  title: string,
  showCloseBtn?: boolean
}

const Header: React.FC<HeaderProps> = ({ title, showCloseBtn = true }) => {
  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <BorderlessButton onPress={navigation.goBack}>
        <Ionicons name="md-arrow-back" size={24} color="#15B6D6" />
      </BorderlessButton>

      <Text style={styles.headerTitle}>{title}</Text>
      
      {
        showCloseBtn && (
          <BorderlessButton onPress={() => navigation.navigate("OrphanagesMap")}>
            <Entypo name="cross" size={24} color="#8FA7B3" />
          </BorderlessButton>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get("window").width,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFC",
    padding: 24,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderColor: "#DDE3F0"
  },

  headerTitle: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#8FA7B3"
  }
})

export default Header