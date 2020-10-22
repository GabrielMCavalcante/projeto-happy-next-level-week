export interface DashboardContextValues {
  fetchRegisteredOrphanages: () => Promise<any>,
  fetchPendingOrphanages: () => Promise<any>,
  fetchOrphanageDetails: (id: number) => Promise<any>,
  updateOrphanage: (id: number) => Promise<any>,
  deleteOrphanage: (id: number) => Promise<any>,
  loading: boolean
}

export interface OrphanageCard {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

interface FetchOrphanagesSuccessData {
  status: 200,
  result: OrphanageCard[]
}

interface FetchOrphanagesFailureData {
  status: 401 | 500,
  message: string
}

export type FetchOrphanagesData = 
  FetchOrphanagesSuccessData | FetchOrphanagesFailureData