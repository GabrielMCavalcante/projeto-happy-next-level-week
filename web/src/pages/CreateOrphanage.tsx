import React, { useState, useEffect } from "react"
import { Map, Marker, TileLayer } from 'react-leaflet'
import Leaflet from 'leaflet'
import { FiPlus, FiX } from "react-icons/fi"
import { useHistory } from 'react-router-dom'

// Services
import api from 'services/axios-config'

// Components
import Sidebar from "components/Sidebar"
import Feedback from "components/Feedback"

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
  const [imagesPreview, setImagesPreview] = useState<string[]>([])
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [instructions, setInstructions] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [openOnWeekends, setOpenOnWeekends] = useState(false)
  const [error, setError] = useState(false)
  const [showFeedback, setShowFeedback] = useState(true)

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
    const imgs = e.target.files!
    setImages(imgs)

    const selectedImagesPreview: string[] = []
    for (let i = 0; i < imgs.length; i++) {
      selectedImagesPreview.push(URL.createObjectURL(imgs[i]))
    }

    setImagesPreview([...imagesPreview, ...selectedImagesPreview])
  }

  async function handleCreateOrphanage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    const formData = new FormData()

    formData.set("name", name)
    formData.set("about", about)
    formData.set("whatsapp", whatsapp)
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
      setShowFeedback(true)
    } catch (err) {
      setError(true)
      setShowFeedback(true)
      console.log(err.message)
    }
  }

  function removeImagePreview(imageURL: string) {
    setImagesPreview([...imagesPreview.filter(imagePreview => imagePreview !== imageURL)])
  }

  const successFeedback = (
    <Feedback
      type="success"
      title="Ebaaa!"
      subtitle="O cadastro deu certo e foi enviado
      ao administrador para ser aprovado.
      Agora é só esperar :)"
      actionButtons={[
        {
          type: "success",
          label: "Voltar para o mapa",
          action: () => navigation.replace("/orfanatos")
        }
      ]}
    />
  )

  const errorFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Ocorreu algum erro ao processar o cadastro :(.
      Por favor, tente novamente mais tarde."
      actionButtons={[
        {
          type: "danger",
          label: "Voltar para o cadastro",
          action: () => setShowFeedback(false)
        },
        {
          type: "danger",
          label: "Voltar para o mapa",
          action: () => navigation.replace("/orfanatos")
        }
      ]}
    />
  )

  return (
    showFeedback
      ? (
        !error
          ? successFeedback
          : errorFeedback
      ) : (
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
                    required
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="input-block">
                  <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                  <textarea
                    required
                    id="about"
                    maxLength={300}
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                  />
                </div>

                <div className="input-block">
                  <label htmlFor="whatsapp">Whatsapp</label>
                  <input
                    required
                    id="whatsapp"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                  />
                </div>

                <div className="input-block">
                  <label htmlFor="images">Fotos</label>

                  <div className="images-container">
                    {
                      imagesPreview.map((imageURL, i) => (
                        <div
                          key={i}
                          className="image-preview-container"
                        >
                          <img
                            className="image-preview"
                            src={imageURL}
                            alt={name}
                            draggable={false}
                          />

                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImagePreview(imageURL)}
                          >
                            <FiX size={24} color="#FF669D" />
                          </button>
                        </div>
                      ))
                    }

                    <label className="new-image" htmlFor="imagesInput">
                      <FiPlus size={24} color="#15b6d6" />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
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
                    required
                    id="instructions"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                  />
                </div>

                <div className="input-block">
                  <label htmlFor="opening_hours">Horário das visitas</label>
                  <input
                    required
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
  )
}
