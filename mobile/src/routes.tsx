import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Text, View } from 'react-native'

// Pages
import OrphanagesMap from 'pages/OrphanagesMap'
import SelectMapPosition from 'pages/SelectMapPosition'
import OrphanageDetails from 'pages/OrphanageDetails'

function Routes() {
  const { Navigator, Screen } = createStackNavigator()

  return (
    <NavigationContainer>
      <Navigator headerMode="none" initialRouteName="OrphanagesMap">
        <Screen name="OrphanagesMap" component={OrphanagesMap} />
        <Screen name="SelectMapPosition" component={SelectMapPosition} />
        <Screen name="OrphanageDetails" component={OrphanageDetails} />
      </Navigator>
    </NavigationContainer>
  )
}

export default Routes