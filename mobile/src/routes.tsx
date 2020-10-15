import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Text, View } from 'react-native'

// Pages
import OrphanagesMap from 'pages/OrphanagesMap'

function OtherScreenOne() {
  return (
    <View>
      <Text>This is another screen one</Text>
    </View>
  )
}

function OtherScreenTwo() {
  return (
    <View>
      <Text>This is another screen two</Text>
    </View>
  )
}

function Routes() {
  const { Navigator, Screen } = createStackNavigator()

  return (
    <NavigationContainer>
      <Navigator headerMode="none">
        <Screen name="OrphanagesMap" component={OrphanagesMap} />
        <Screen name="OtherScreenOne" component={OtherScreenOne} />
        <Screen name="OtherScreenTwo" component={OtherScreenTwo} />
      </Navigator>
    </NavigationContainer>
  )
}

export default Routes