import React, { useState } from 'react'
import Leaflet from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { FiPlus, FiArrowRight } from 'react-icons/fi'

// Images
import happyFace from 'assets/images/happy-face-logo.svg'

// Styles
import 'assets/styles/pages/orphanageMap.css'
import 'leaflet/dist/leaflet.css'

function OrphanageMap() {

    const [lat, setLat] = useState(-3.0828679)
    const [lng, setLng] = useState(-60.0115209)
    const [zoom, setZoom] = useState(15)

    const position: [number, number] = [lat, lng]

    const mapIcon = Leaflet.icon({
        iconUrl: happyFace,
        iconSize: [58, 68],
        iconAnchor: [29, 68],
        popupAnchor: [178, 2]
    })

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={happyFace} alt="Happy Face Logo" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Manaus</strong>
                    <span>Amazonas</span>
                </footer>
            </aside>

            <Map
                center={position}
                zoom={zoom}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker 
                    icon={mapIcon} 
                    position={position}
                >
                    <Popup
                        closeButton={false}
                        minWidth={240}
                        maxWidth={240}
                        className="map-popup"
                    >
                        Lar das meninas
                        <Link to="/orfanatos/1">
                            <FiArrowRight size={24} color="#FFFFFF" />
                        </Link>
                    </Popup>
                </Marker>
            </Map>

            <Link to="/orfanatos/criar" id="create-orphanage-btn">
                <FiPlus size={32} color="#FFFFFF" />
            </Link>
        </div>
    )
}

export default OrphanageMap