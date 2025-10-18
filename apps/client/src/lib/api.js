const BASE = import.meta.env.VITE_API_BASE_URL

async function req(path, { method='GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
        credentials: 'include'
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
  return data
}

export const api = {
  // Profiles
  listProfiles: () => req('/api/profiles'),
  createProfile: (payload) => req('/api/profiles', { method: 'POST', body: payload }),
  updateProfileTimezone: (id, timezone) =>
    req(`/api/profiles/${id}`, { method: 'PATCH', body: { timezone } }),

  // Events
  listEventsForProfile: (profileId) => req(`/api/events?profileId=${profileId}`),
  createEvent: (payload) => req('/api/events', { method: 'POST', body: payload }),
  updateEvent: (id, payload) => req(`/api/events/${id}`, { method: 'PATCH', body: payload }),

  // Logs
  listLogs: (eventId) => req(`/api/events/logs/${eventId}`),
}