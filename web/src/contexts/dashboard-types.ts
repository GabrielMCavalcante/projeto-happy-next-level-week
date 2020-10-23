export type OrphanagesData = { registered: OrphanageCard[], pending: OrphanageCard[] }

export interface DashboardContextValues {
  fetchOrphanages: (storedToken: string | null) => Promise<any>,
  fetchOrphanageDetails: (id: number) => Promise<any>,
  updateOrphanage: (id: number, formData: FormData) => Promise<any>,
  deleteOrphanage: (id: number) => Promise<any>,
  callRefetch: () => void,
  orphanages: OrphanagesData | null,
  reFetch: boolean,
  loading: boolean
}

export interface OrphanageCard {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}