import { create } from 'zustand'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

export const useProfiles = create((set, get) => ({
  profiles: [],
  loading: false,
  error: null,

  fetchProfiles: async () => {
    set({ loading: true, error: null })
    try {
      const profiles = await api.listProfiles()
      set({ profiles, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
      toast.error(e.message)
    }
  },

  createProfile: async (name, timezone) => {
    const tid = toast.loading('Creating profile…')
    try {
      const p = await api.createProfile({ name, timezone })
      set({ profiles: [p, ...get().profiles] })
      toast.success('Profile created', { id: tid })
      return p
    } catch (e) {
      toast.error(e.message, { id: tid })
      throw e
    }
  },

  updateProfileTimezone: async (id, timezone) => {
    const tid = toast.loading('Updating timezone…')
    try {
      const p = await api.updateProfileTimezone(id, timezone)
      set({ profiles: get().profiles.map((x) => (x._id === p._id ? p : x)) })
      toast.success('Timezone updated', { id: tid })
      return p
    } catch (e) {
      toast.error(e.message, { id: tid })
      throw e
    }
  },
}))