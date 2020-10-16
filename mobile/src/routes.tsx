import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Text, View } from "react-native"

// Pages
import OrphanagesMap from "pages/OrphanagesMap"
import SelectMapPosition from "pages/SelectMapPosition"
import OrphanageDetails from "pages/OrphanageDetails"
import Header from "components/Header"
import OrphanageData from "pages/OrphanageData"

function Routes() {
  const { Navigator, Screen } = createStackNavigator()

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }} initialRouteName="OrphanagesMap">
        <Screen name="OrphanagesMap" component={OrphanagesMap} />
        <Screen 
          name="SelectMapPosition" 
          component={SelectMapPosition} 
          options={{
            headerShown: true,
            header: () => <Header title="Selecione um local no mapa"/>
          }}
        />
        <Screen 
          name="OrphanageDetails" 
          component={OrphanageDetails} 
          options={{
            headerShown: true,
            header: () => <Header showCloseBtn={false} title="Detalhes do orfanato"/>
          }}
        />
        <Screen 
          name="OrphanageData" 
          component={OrphanageData} 
          options={{
            headerShown: true,
            header: () => <Header title="Informe os dados"/>
          }}
        />
      </Navigator>
    </NavigationContainer>
  )
}

export default Routes