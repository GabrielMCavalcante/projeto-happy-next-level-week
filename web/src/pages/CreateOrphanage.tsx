import React, { useState, useEffect } from "react"
import { Map, Marker, TileLayer } from 'react-leaflet'
import Leaflet from 'leaflet'
import { FiPlus } from "react-icons/fi"
import { useHistory } from 'react-router-dom'

// Services
import api from 'services/axios-config'

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
    const navigation = useHistory()
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0])

    const [images, setImages] = useState<FileList>()
    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [instructions, setInstructions] = useState("")
    const [openingHours, setOpeningHours] = useState("")
    const [openOnWeekends, setOpenOnWeekends] = useState(false)

    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(params => {
                const coords = params.coords
                setMapCenter([coords.latitude, coords.longitude])
            })
        }
    }, [])

    function handleMapClick(e: { latlng: { lat: number, lng: number } }) {
        setMarkerPosition([e.latlng.lat, e.latlng.lng])
    }

    function handleImageSelection(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        setImages(e.target.files!)
    }

    async function handleCreateOrphanage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData()

        formData.set("name", name)
        formData.set("about", about)
        formData.set("instructions", instructions)
        formData.set("opening_hours", openingHours)
        formData.set("open_on_weekends", String(openOnWeekends))
        formData.set("latitude", String(markerPosition[0]))
        formData.set("longitude", String(markerPosition[1]))

        for (let i = 0; i < images!.length; i++) {
            formData.append("images", images!.item(i)!)
        }
        
        try {
            await api.post("/orphanages", formData)
            await window.confirm("Orfanato cadastrado com sucesso!")
            navigation.replace("/orfanatos")
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div id="page-create-orphanage">
            <Sidebar />

            <main>
                <form className="create-orphanage-form" onSubmit={handleCreateOrphanage}>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={mapCenter}
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

                            <div className="images-container">
                                <label className="new-image" htmlFor="imagesInput">
                                    <FiPlus size={24} color="#15b6d6" />
                                </label>
                                <input 
                                    type="file"
                                    multiple
                                    onChange={handleImageSelection} 
                                    id="imagesInput" 
                                    style={{ display: 'none' }}
                                />
                            </div>
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
