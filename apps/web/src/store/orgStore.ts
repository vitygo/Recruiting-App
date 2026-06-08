import { create } from 'zustand'
import { loadDemoOrg, saveDemoOrg } from '../lib/demoStorage'

interface OrgState {
  companyName: string
  setCompanyName: (name: string) => void
}

export const useOrgStore = create<OrgState>((set) => ({
  companyName: loadDemoOrg().companyName,
  setCompanyName: (name: string) => {
    saveDemoOrg({ companyName: name })
    set({ companyName: name })
  },
}))
