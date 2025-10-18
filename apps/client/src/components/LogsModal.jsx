import { useEffect } from 'react'
import { useEvents } from '../store/events'
import { useProfiles } from '../store/profiles'
import { fmtInTz } from '../lib/time'

export default function LogsModal({ eventId, open, onClose, viewer }) {
  const { logs, fetchLogs } = useEvents()
  const { profiles } = useProfiles()

  // ✅ Fetch logs when modal opens
  useEffect(() => {
    if (open && eventId) {
      fetchLogs(eventId)
    }
  }, [open, eventId]) // Removed fetchLogs from deps to avoid unnecessary calls

  if (!open) return null

  const nameById = Object.fromEntries(profiles.map(p => [String(p._id), p.name]))

  // ✅ Normalize old formats (IDs as strings, JSON, comma-separated)
  const parseIdList = (val) => {
    if (!val) return []
    if (Array.isArray(val)) return val.map(String)
    const s = String(val)
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const arr = JSON.parse(s)
        return Array.isArray(arr) ? arr.map(String) : []
      } catch { /* ignore */ }
    }
    if (s.includes(',')) return s.split(',').map((x) => x.trim()).filter(Boolean)
    return [s]
  }

  // ✅ Render changes with better readability
  const renderChange = (c) => {
    if (c.field === 'profiles') {
      const oldNames = parseIdList(c.old).map(id => nameById[id] || id).join(', ')
      const newNames = parseIdList(c.new).map(id => nameById[id] || id).join(', ')
      return (<li><b>Profiles:</b> {oldNames || '—'} → {newNames || '—'}</li>)
    }
    if (c.field === 'startUtc') return (<li><b>Start time:</b> changed</li>)
    if (c.field === 'endUtc')   return (<li><b>End time:</b> changed</li>)
    if (c.field === 'eventTz')  return (<li><b>Event TZ:</b> {String(c.old)} → {String(c.new)}</li>)
    return (<li><b>{c.field}:</b> {String(c.old)} → {String(c.new)}</li>)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="text-lg font-semibold">Update Logs</h4>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-auto space-y-4">
          {logs.length === 0 && <p className="text-sm text-slate-500">No updates yet.</p>}
          {logs.map((l) => (
            <div key={l._id} className="rounded border p-3">
              <div className="text-xs text-slate-500 mb-2">
                {fmtInTz(l.changedAtUtc, viewer.timezone)} (viewer TZ)
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {l.changes?.map((c, i) => <div key={i}>{renderChange(c)}</div>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-3 flex justify-end">
          <button className="btn border" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}