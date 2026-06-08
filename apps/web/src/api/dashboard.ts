import client from './client'

export interface DashboardStats {
  totalCandidates: number
  totalJobs: number
  totalInterviews: number
}

export const dashboardApi = {
  getStats: async () => {
    const res = await client.get<DashboardStats>('/dashboard/stats')
    return res.data
  },
}
