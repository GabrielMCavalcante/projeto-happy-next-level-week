import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import { AppLoading } from 'expo'

function OrphanagesMap() {
  const [location, setLocation] = useState<[number, number]>([0, 0])

  useEffect(() => {
    (async function () {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        setLocation([-3.1189334, -60.0207567])
      }

      const loc = await Location.getCurrentPositionAsync({})
      const coords: [number, number] = [loc.coords.latitude, loc.coords.longitude]
      setLocation(coords)
    })()
  }, [])

  return (
    <View>
      {
        location[0] !== 0
          && location[1] !== 0
          ? (
            <MapView
              initialRegion={{
                latitude: location[0],
                longitude: location[1],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              minZoomLevel={15}
              style={styles.mapStyle}
            />
          ) : <AppLoading />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

export default OrphanagesMap