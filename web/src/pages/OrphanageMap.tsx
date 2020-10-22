import React, { useState, useEffect } from 'react'
import Leaflet from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link, useHistory } from 'react-router-dom'
import { FiPlus, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

// Services
import api from 'services/axios-config'

// Images
import { happyFaceLogo } from 'utils/images'

// Styles
import 'assets/styles/pages/orphanageMap.css'

interface OrphanageMarker {
  name: string,
  id: number,
  latitude: number,
  longitude: number
}

function OrphanageMap() {
  const zoom = 15

  const [orphanages, setOrphanages] = useState<OrphanageMarker[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const { replace } = useHistory()

  useEffect(() => {
    (async function () {
      const response = await api.get("/orphanages")
      setOrphanages(response.data.result)
    })()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(params => {
        const coords = params.coords
        setMapCenter([coords.latitude, coords.longitude])
      })
    }
  }, [])

  const mapIcon = Leaflet.icon({
    iconUrl: happyFaceLogo,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [178, 2]
  })

  return (
    <div id="page-map">
      <aside>
        <button type="button" onClick={() => replace("/")}>
          <FiArrowLeft size={24} color="#FFFFFF" />
        </button>
        <header>
          <img src={happyFaceLogo} alt="Happy Face Logo" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Manaus</strong>
          <span>Amazonas</span>
        </footer>
      </aside>

      {
        orphanages && (
          <Map
            center={mapCenter}
            zoom={zoom}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
            />
            {
              orphanages.map(orphanage => (
                <Marker
                  key={orphanage.id}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                >
                  <Popup
                    closeButton={false}
                    minWidth={240}
                    maxWidth={240}
                    className="map-popup"
                  >
                    {orphanage.name}
                    <Link to={`/orfanatos/${orphanage.id}`}>
                      <FiArrowRight size={24} color="#FFFFFF" />
                    </Link>
                  </Popup>
                </Marker>
              ))
            }
          </Map>
        )
      }

      <Link to="/orfanatos/criar" id="create-orphanage-btn">
        <FiPlus size={32} color="#FFFFFF" />
      </Link>
    </div>
  )
}

export default OrphanageMap