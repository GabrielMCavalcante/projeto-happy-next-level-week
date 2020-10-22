export type OrphanagesData = { registered: OrphanageCard[], pending: OrphanageCard[] }

export interface DashboardContextValues {
  fetchOrphanages: () => Promise<any>,
  fetchOrphanageDetails: (id: number) => Promise<any>,
  updateOrphanage: (id: number) => Promise<any>,
  deleteOrphanage: (id: number) => Promise<any>,
  orphanages: OrphanagesData | null,
  loading: boolean
}

export interface OrphanageCard {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}