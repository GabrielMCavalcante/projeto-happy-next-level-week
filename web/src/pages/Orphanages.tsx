import React, { useEffect, useState } from "react"
import { FiTrash, FiEdit3 } from "react-icons/fi"
import { Link, Redirect, Route, Switch } from "react-router-dom"
import { Map, Marker, TileLayer } from "react-leaflet"
import Leaflet from 'leaflet'
import Loader from "react-loader-spinner"

// Contexts
import useDashboard from "contexts/dashboard"

// Images
import { happyFaceLogo, NoOrphanageFaceLogo } from 'utils/images'

// Components
import Sidebar from "components/Sidebar"
import EditOrphanage from "components/EditOrphanage"

// Styles
import "assets/styles/pages/orphanageList.css"

// Interfaces
import { OrphanageCard } from "contexts/dashboard-types"

interface OrphanageListProps {
  type: "registered" | "pending"
}

const OrphanageList: React.FC<OrphanageListProps> = ({ type }) => {
  const dashboardContext = useDashboard()
  const [orphanages, setOrphanages] = useState<OrphanageCard[]>([])

  useEffect(() => {
    if (dashboardContext.orphanages && type) {
      setOrphanages(dashboardContext.orphanages[type])
    }
  }, [dashboardContext.orphanages, type])

  const happyMapIcon = Leaflet.icon({
    iconUrl: happyFaceLogo,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [0, -60]
  })

  return (
    <div className="dashboard-content">
      <header className="dashboard-content-header">
        <h1>{
          type === "registered"
            ? "Orfanatos cadastrados"
            : "Cadastros pendentes"
        }</h1>

        <p>{orphanages.length} orfanato{orphanages.length !== 1 ? "s" : ""}</p>
      </header>

      {
        dashboardContext.loading
          ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
          : (
            orphanages.length === 0
              ? (
                <div className="no-orphanage">
                  <img src={NoOrphanageFaceLogo} alt="Nenhum orfanato"/>
                  <p>Nenhum no momento</p>
                </div>
              ) : (
                <main>
                  {
                    orphanages.map(orphanage => (
                      <div key={orphanage.id} className="orphanage-card">
                        <Map
                          center={[orphanage.latitude, orphanage.longitude]}
                          zoom={16}
                          style={{ width: '100%', height: 280, borderRadius: 20 }}
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
                          <h3>{orphanage.name}</h3>

                          <div>
                            <Link to={`/dashboard/orfanato/excluir/${orphanage.id}`}>
                              <FiTrash size={24} color="#15C3D6" />
                            </Link>

                            <Link to={
                              type === "registered"
                                ? `/acesso-restrito/dashboard/orfanatos/cadastrados/editar/${orphanage.id}`
                                : `/acesso-restrito/dashboard/orfanatos/pendentes/editar/${orphanage.id}`
                            }>
                              <FiEdit3 size={24} color="#15C3D6" />
                            </Link>
                          </div>
                        </footer>
                      </div>
                    ))
                  }
                </main>
              )
          )
      }
    </div>
  )
}

function Orphanages() {
  return (
    <>
      <Sidebar showNavigation />
      <Switch>
        <Route path="/acesso-restrito/dashboard/orfanatos/cadastrados" exact>
          <OrphanageList type="registered" />
        </Route>
        <Route path="/acesso-restrito/dashboard/orfanatos/pendentes" exact>
          <OrphanageList type="pending" />
        </Route>
        <Route path="/acesso-restrito/dashboard/orfanatos/cadastrados/editar/:id">
          <EditOrphanage type="normal" method="update" />
        </Route>
        <Route path="/acesso-restrito/dashboard/orfanatos/pendentes/editar/:id">
          <EditOrphanage type="pending" method="accept" />
        </Route>
        <Redirect to="/acesso-restrito/dashboard/orfanatos/cadastrados" />
      </Switch>
    </>
  )
}

export default Orphanages