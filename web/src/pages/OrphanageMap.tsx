import React, { useState } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'

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
                    url={process.env.API_KEY!}
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </Map>

            <Link to="/" id="create-orphanage-btn">
                <FiPlus size={32} color="#FFFFFF" />
            </Link>
        </div>
    )
}

export default OrphanageMap