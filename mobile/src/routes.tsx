import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

// Pages
import OrphanagesMap from "pages/OrphanagesMap"
import SelectMapPosition from "pages/SelectMapPosition"
import OrphanageDetails from "pages/OrphanageDetails"
import Header from "components/Header"
import OrphanageInfo from "pages/OrphanageInfo"

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
            header: () => <Header title="Selecione um local no mapa" />
          }}
        />
        <Screen
          name="OrphanageDetails"
          component={OrphanageDetails}
          options={{
            headerShown: true,
            header: () => <Header showCloseBtn={false} title="Orfanato" />
          }}
        />
        <Screen
          name="OrphanageInfo"
          component={OrphanageInfo}
          options={{
            headerShown: false,
          }}
        />
      </Navigator>
    </NavigationContainer>
  )
}

export default Routes