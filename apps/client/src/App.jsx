import { useEffect, useMemo, useState } from 'react'
import Toast from './ui/Toast'
import { useProfiles } from './store/profiles'
import { useEvents } from './store/events'
import ProfileDropdown from './components/ProfileDropdown'
import CreateEventForm from './components/CreateEventForm'
import EventRow from './components/EventRow'
import LogsModal from './components/LogsModal'
import Spinner from './ui/Spinner'

export default function App() {
  const { profiles, fetchProfiles } = useProfiles()
  const { events, fetchEvents, loading } = useEvents()
  const [viewerProfileId, setViewerProfileId] = useState('')
  const [logsOpen, setLogsOpen] = useState(false)
  const [logsEventId, setLogsEventId] = useState(null)

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  useEffect(() => {
    if (!viewerProfileId && profiles.length) setViewerProfileId(profiles[0]._id)
  }, [profiles, viewerProfileId])

  useEffect(() => {
    if (viewerProfileId) fetchEvents(viewerProfileId)
  }, [viewerProfileId, fetchEvents])

  const viewer = useMemo(
    () => profiles.find((p) => p._id === viewerProfileId),
    [profiles, viewerProfileId]
  )

  return (
    <>
      <Toast />
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">MERN Event System</div>
          <ProfileDropdown
            viewerProfileId={viewerProfileId}
            setViewerProfileId={setViewerProfileId}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Create Event */}
          <CreateEventForm viewerProfileId={viewerProfileId} />

          {/* RIGHT: Events list */}
          <div>
            <div className="mb-2 text-sm text-slate-600">
              Viewing as: <b>{viewer ? `${viewer.name} (${viewer.timezone})` : '—'}</b>
            </div>

            {loading ? (
              <div className="card flex items-center gap-2 text-slate-600">
                <Spinner /> Loading events…
              </div>
            ) : (
              <div className="space-y-3">
                {events.length === 0 && (
                  <div className="card text-sm text-slate-600">
                    No events for this profile yet.
                  </div>
                )}
                {viewer && events.map((e) => (
                  <EventRow
                    key={e._id}
                    e={e}
                    viewer={viewer}
                    onShowLogs={(id) => { setLogsEventId(id); setLogsOpen(true) }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <LogsModal
        open={logsOpen}
        eventId={logsEventId}
        onClose={() => setLogsOpen(false)}
        viewer={viewer || { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }}
      />
    </>
  )
}