import { create } from 'zustand'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

export const useEvents = create((set, get) => ({
  events: [],
  logs: [],
  loading: false,
  error: null,

  fetchEvents: async (profileId) => {
    if (!profileId) return set({ events: [] })
    set({ loading: true, error: null })
    try {
      const events = await api.listEventsForProfile(profileId)
      set({ events, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
      toast.error(e.message)
    }
  },

  createEvent: async (payload, currentViewerProfileId) => {
    const tid = toast.loading('Creating event…')
    try {
      const ev = await api.createEvent(payload)
      // refresh viewer's list if viewer is among assigned
      if (payload.profiles?.includes(currentViewerProfileId)) {
        await get().fetchEvents(currentViewerProfileId)
      }
      toast.success('Event created', { id: tid })
      return ev
    } catch (e) {
      toast.error(e.message, { id: tid })
      throw e
    }
  },

  updateEvent: async (eventId, payload, currentViewerProfileId) => {
    const tid = toast.loading('Saving changes…')
    try {
      await api.updateEvent(eventId, payload)
      await get().fetchEvents(currentViewerProfileId)
      toast.success('Saved', { id: tid })
    } catch (e) {
      toast.error(e.message, { id: tid })
      throw e
    }
  },

  fetchLogs: async (eventId) => {
    set({ loading: true, error: null })
    try {
      const logs = await api.listLogs(eventId)
      set({ logs, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
      toast.error(e.message)
    }
  },
}))