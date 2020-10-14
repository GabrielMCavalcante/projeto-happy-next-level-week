import React, { useState } from "react"
import { Map, Marker, TileLayer } from 'react-leaflet'
import Leaflet from 'leaflet'
import { FiPlus } from "react-icons/fi"

// Components
import Sidebar from "components/Sidebar"

// Images
import { happyFaceLogo } from 'utils/images'

// Styles
import 'assets/styles/pages/create-orphanage.css'

const happyMapIcon = Leaflet.icon({
    iconUrl: happyFaceLogo,

    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [0, -60]
})

export default function CreateOrphanage() {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0])

    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [instructions, setInstructions] = useState("")
    const [openingHours, setOpeningHours] = useState("")
    const [openOnWeekends, setOpenOnWeekends] = useState(false)

    function handleMapClick(e: { latlng: { lat: number, lng: number } }) {
        setMarkerPosition([e.latlng.lat, e.latlng.lng])
    }

    function handleCreateOrphanage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        console.log({
            data: {
                name,
                about,
                instructions,
                openingHours,
                openOnWeekends,
                location: {
                    latitude: markerPosition[0],
                    longitude: markerPosition[1]
                }
            }
        })
    }

    return (
        <div id="page-create-orphanage">
            <Sidebar />

            <main>
                <form className="create-orphanage-form" onSubmit={handleCreateOrphanage}>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[-27.2092052, -49.6401092]}
                            style={{ width: '100%', height: 280 }}
                            zoom={15}
                            onClick={handleMapClick}
                        >
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                            />

                            <Marker
                                interactive={false}
                                icon={happyMapIcon}
                                position={[markerPosition[0], markerPosition[1]]}
                            />
                        </Map>

                        <div className="input-block">
                            <label htmlFor="name">Nome</label>
                            <input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                            <textarea
                                id="about"
                                maxLength={300}
                                value={about}
                                onChange={e => setAbout(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>

                            <div className="uploaded-image">

                            </div>

                            <button className="new-image">
                                <FiPlus size={24} color="#15b6d6" />
                            </button>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <div className="input-block">
                            <label htmlFor="instructions">Instruções</label>
                            <textarea
                                id="instructions"
                                value={instructions}
                                onChange={e => setInstructions(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="opening_hours">Horário das visitas</label>
                            <input
                                id="opening_hours"
                                value={openingHours}
                                onChange={e => setOpeningHours(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="open_on_weekends">Atende fim de semana</label>

                            <div className="button-select">
                                <button 
                                    type="button" 
                                    className={["yes", openOnWeekends ? "active" : ""].join(" ")}
                                    onClick={() => setOpenOnWeekends(true)}
                                >Sim</button>
                                <button 
                                    type="button" 
                                    className={["no", !openOnWeekends ? "active" : ""].join(" ")}
                                    onClick={() => setOpenOnWeekends(false)}
                                >Não</button>
                            </div>
                        </div>
                    </fieldset>

                    <button className="confirm-button" type="submit">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    )
}
