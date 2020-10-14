import React, { useState, useEffect } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { FiClock, FiInfo } from "react-icons/fi"
import { Map, Marker, TileLayer } from "react-leaflet"
import Leaflet from 'leaflet'
import { useParams, useHistory } from 'react-router-dom'

// Services
import api from 'services/axios-config'

// Components
import Sidebar from 'components/Sidebar'

// Images
import { happyFaceLogo } from 'utils/images'

// Styles
import 'assets/styles/pages/orphanage.css'

const happyMapIcon = Leaflet.icon({
  iconUrl: happyFaceLogo,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

interface Image {
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

interface DetailsRouteParams {
  id: string
}

export default function Orphanage() {
  const [orphanage, setOrphanage] = useState<Orphanage>()
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const { id } = useParams<DetailsRouteParams>()
  const { goBack } = useHistory()

  useEffect(() => {
    (async function () {
      try {
        const response = await api.get(`/orphanages/${id}`)
        const data = response.data.result

        setOrphanage(data)
        setImages([...data.images])
        setSelectedImage(data.images[0].id)
      } catch (err) {
        await window.confirm({ ...err }.response.data.message)
        goBack()
      }
    })()
  }, [goBack, id])

  return (
    <div id="page-orphanage">
      <Sidebar />
      {
        orphanage && (
          <main>
            <div className="orphanage-details">
              {
                images && (
                  <>
                    <img
                      src={images.filter(image => image.id === selectedImage)[0]?.url}
                      alt={orphanage.name}
                    />

                    <div className="images">
                      {
                        images.map(image => (
                          <button
                            key={image.id}
                            className={image.id === selectedImage ? "active" : ""}
                            type="button"
                            onClick={() => {
                              setSelectedImage(image.id)
                            }}
                          >
                            <img src={image.url} alt={orphanage.name} />
                          </button>
                        ))
                      }
                    </div>
                  </>
                )
              }

              <div className="orphanage-details-content">
                <h1>{orphanage.name}</h1>
                <p>{orphanage.about}</p>

                <div className="map-container">
                  <Map
                    center={[orphanage.latitude, orphanage.longitude]}
                    zoom={16}
                    style={{ width: '100%', height: 280 }}
                    dragging={false}
                    touchZoom={false}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                  >
                    <TileLayer
                      url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                    />
                    <Marker
                      interactive={false}
                      icon={happyMapIcon}
                      position={[orphanage.latitude, orphanage.longitude]}
                    />
                  </Map>

                  <footer>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://www.google.com/maps/dir/?api=1&&destination=${orphanage.latitude},${orphanage.longitude}`}
                    >
                      Ver rotas no Google Maps
                    </a>
                  </footer>
                </div>

                <hr />

                <h2>Instruções para visita</h2>
                <p>{orphanage.instructions}</p>

                <div className="open-details">
                  <div className="hour">
                    <FiClock size={32} color="#15B6D6" />
                    {orphanage.opening_hours}
                  </div>
                  <div className={
                    orphanage.open_on_weekends
                      ? "open-on-weekends"
                      : "not-open-on-weekends"
                  }>
                    <FiInfo
                      size={32}
                      color={
                        orphanage.open_on_weekends
                          ? "#39CC83"
                          : "#FF669D"
                      }
                    />
                    {
                      orphanage.open_on_weekends
                        ? "Atendemos aos fins de semana"
                        : "Não atendemos aos fins de semana"
                    }
                  </div>
                </div>

                <button type="button" className="contact-button">
                  <FaWhatsapp size={20} color="#FFF" />
                  Entrar em contato
                </button>
              </div>
            </div>
          </main>
        )
      }
    </div>
  )
}