export interface DashboardContextValues {
  fetchRegisteredOrphanages: () => Promise<any>,
  fetchPendingOrphanages: () => Promise<any>,
  fetchOrphanageDetails: (id: number) => Promise<any>,
  updateOrphanage: (id: number) => Promise<any>,
  deleteOrphanage: (id: number) => Promise<any>,
  loading: boolean
}