import React, { useState, useEffect } from "react"
import { Map, Marker, TileLayer } from "react-leaflet"
import Leaflet from "leaflet"
import { FiPlus, FiX, FiXCircle, FiCheck } from "react-icons/fi"
import { useHistory, useParams } from "react-router-dom"
import Loader from "react-loader-spinner"

// Services
import api from "services/axios-config"

// Components
import Sidebar from "components/Sidebar"
import Feedback from "components/Feedback"

// Contexts
import useDashboard from "contexts/dashboard"

// Images
import { happyFaceLogo } from "utils/images"

// Styles
import "assets/styles/pages/create-orphanage.css"

const happyMapIcon = Leaflet.icon({
  iconUrl: happyFaceLogo,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

interface EditOrphanage {
  type: "normal" | "pending",
  method: "update" | "accept"
}

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
  open_on_weekends: boolean,
  images: Image[],
  whatsapp: string
}

const EditOrphanage: React.FC<EditOrphanage> = (props) => {
  const { type, method } = props

  const navigation = useHistory()
  const { id } = useParams() as any
  const [orphanage, setOrphanage] = useState<Orphanage>()
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0])
  const [images, setImages] = useState<{ id: number, file: File }[]>([])
  const [imagesPreview, setImagesPreview] = useState<string[]>([])
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [instructions, setInstructions] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [openOnWeekends, setOpenOnWeekends] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const dashboardContext = useDashboard()

  useEffect(() => {
    (async function () {
      const response = await dashboardContext.fetchOrphanageDetails(id)

      if (response.status === 200) {
        setOrphanage(response.result)
      }
    })()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (orphanage) {
      setMapCenter([orphanage.latitude, orphanage.longitude])
      setMarkerPosition([orphanage.latitude, orphanage.longitude])
      setName(orphanage.name)
      setAbout(orphanage.about)
      setInstructions(orphanage.instructions)
      setOpeningHours(orphanage.opening_hours)
      setOpenOnWeekends(orphanage.open_on_weekends)
      setWhatsapp(orphanage.whatsapp)

      async function fetchImages() {
        const selectedImagesPreview: string[] = []

        const fetchedImages: { id: number, file: File }[] = []

        let imgIndex = 0
        for (const image of orphanage!.images) {
          const imageFile = await api.get<File>(image.url, { responseType: "blob" })
          fetchedImages.push({ id: imgIndex, file: imageFile.data })
          selectedImagesPreview.push(image.url)
          imgIndex++
        }

        setImagesPreview(selectedImagesPreview)
        setImages(fetchedImages)
      }

      fetchImages()
    }
  }, [orphanage])

  function handleMapClick(e: { latlng: { lat: number, lng: number } }) {
    setMarkerPosition([e.latlng.lat, e.latlng.lng])
  }

  function handleImageSelection(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist()
    const imgs = e.target.files!

    const imgsArray: { id: number, file: File }[] = []
    let imgIndex =
      images.length > 0
        ? images[images.length - 1].id + 1
        : 0


    for (const file of imgs) {
      imgsArray.push({ id: imgIndex, file })
      imgIndex++
    }

    setImages([...images, ...imgsArray])

    const selectedImagesPreview: string[] = []
    for (let i = 0; i < imgs.length; i++) {
      selectedImagesPreview.push(URL.createObjectURL(imgs[i]))
    }

    setImagesPreview([...imagesPreview, ...selectedImagesPreview])
  }

  async function handleUpdateOrphanage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    const formData = new FormData()

    formData.set("name", name)
    formData.set("about", about)
    formData.set("whatsapp", whatsapp)
    formData.set("instructions", instructions)
    formData.set("opening_hours", openingHours)
    formData.set("open_on_weekends", String(openOnWeekends))
    formData.set("latitude", String(markerPosition[0]))
    formData.set("longitude", String(markerPosition[1]))

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i].file)
    }

    try {
      setLoading(true)
      if (method === "update") {
        await api.post("/orphanages", formData)

        setSuccess("edit")
      } else {
        const status = await dashboardContext.updateOrphanage(id, formData)

        switch (status) {
          case 200: {
            setSuccess("accept")
            break
          }
          case 401: {
            setError("unauthorized")
            setShowFeedback(true)
            break
          }
          case 404: {
            setError("not-found")
            setShowFeedback(true)
            break
          }
          default: {
            setError("error")
            setShowFeedback(true)
          }
        }
      }
      setLoading(false)
      setShowFeedback(true)
    } catch (err) {
      setLoading(false)
      if ({ ...err }.response.status === 401) {
        setError("unauthorized")
      } else {
        setError("error")
      }
      setShowFeedback(true)
    }
  }

  async function handleDeleteOrphanage() {
    const status = await dashboardContext.deleteOrphanage(id)

    switch (status) {
      case 200: {
        setSuccess("reject")
        break
      }
      case 401: {
        setError("unauthorized")
        setShowFeedback(true)
        break
      }
      case 404: {
        setError("not-found")
        setShowFeedback(true)
        break
      }
      default: {
        setError("error")
        setShowFeedback(true)
      }
    }
  }

  function removeImage(imageURL: string, imageId: number) {
    setImages(images.filter(img => {
      if (img.id !== imageId) {
        if (img.id > imageId) {
          img.id--
        }
        return img
      } return false
    }))
    setImagesPreview([...imagesPreview.filter(imagePreview => imagePreview !== imageURL)])
  }

  const successByEdittingFeedback = (
    <Feedback
      type="success"
      title="Ebaaa!"
      subtitle="A edição foi salva com sucesso. Aproveite!"
      actionButtons={[
        {
          type: "success",
          label: "Voltar para a dashboard",
          action: () => navigation.replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  const successByAcceptingFeedback = (
    <Feedback
      type="success"
      title="Ebaaa!"
      subtitle={`O cadastro do orfanato ${orphanage?.name} foi concluído com sucesso.`}
      actionButtons={[
        {
          type: "success",
          label: "Voltar para a dashboard",
          action: () => navigation.replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  const successByRejectingFeedback = (
    <Feedback
      type="success"
      title="Ebaaa!"
      subtitle={`O cadastro do orfanato ${orphanage?.name} foi rejeitado com sucesso.`}
      actionButtons={[
        {
          type: "success",
          label: "Voltar para a dashboard",
          action: () => navigation.replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  const errorByUnauthorizedFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Você não tem permissão para acessar este conteúdo. 
      Por favor, faça o login e tente novamente."
      actionButtons={[
        {
          type: "danger",
          label: "Fazer login",
          action: () => navigation.replace("/acesso-restrito/login")
        },
        {
          type: "danger",
          label: "Voltar para o menu",
          action: () => navigation.replace("/")
        }
      ]}
    />
  )

  const errorByNotFoundFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Não foi encontrado nenhum orfanato com o id especificado. 
      Tente novamente mais tarde."
      actionButtons={[
        {
          type: "danger",
          label: "Voltar para a dashboard",
          action: () => navigation.replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  const errorFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Ocorreu algum erro durante a requisição. Tente novamente mais tarde."
      actionButtons={[
        {
          type: "danger",
          label: "Voltar para a edição",
          action: () => setShowFeedback(false)
        },
        {
          type: "danger",
          label: "Voltar para a dashboard",
          action: () => navigation.replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  return (
    showFeedback
      ? (
        !error
          ? (
            success === "edit"
              ? successByEdittingFeedback
              : (
                success === "accept"
                  ? successByAcceptingFeedback
                  : successByRejectingFeedback
              )
          ) : (
            error === "unauthorized"
              ? errorByUnauthorizedFeedback
              : (
                error === "not-found"
                  ? errorByNotFoundFeedback
                  : errorFeedback
              )
          )
      ) : (
        <div id="page-create-orphanage">
          <Sidebar />

          <main>
            <form className="create-orphanage-form" onSubmit={handleUpdateOrphanage}>
              <fieldset>
                <legend>Dados</legend>

                <Map
                  center={mapCenter}
                  style={{ width: "100%", height: 280 }}
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
                            onClick={() => removeImage(imageURL, images[i].id)}
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
                      style={{ display: "none" }}
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
              {
                type === "normal"
                  ? (
                    <button
                      className="submit-btn confirm-button"
                      type="submit"
                      disabled={loading}
                    >
                      {
                        loading
                          ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
                          : "Confirmar"
                      }
                    </button>
                  ) : (
                    <footer>
                      <button
                        className="submit-btn reject-button"
                        type="button"
                        disabled={loading}
                        onClick={handleDeleteOrphanage}
                      >
                        {
                          loading
                            ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
                            : <><FiXCircle size={24} color="#FFFFFF" />Rejeitar</>
                        }
                      </button>

                      <button
                        className="submit-btn accept-button"
                        type="submit"
                        disabled={loading}
                      >
                        {
                          loading
                            ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
                            : <><FiCheck size={24} color="#FFFFFF" />Aceitar</>
                        }
                      </button>
                    </footer>
                  )
              }
            </form>
          </main>
        </div>
      )
  )
}

export default EditOrphanage