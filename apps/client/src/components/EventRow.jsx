import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

import { useEvents } from '../store/events'
import { useProfiles } from '../store/profiles'
import { fmtInTz, toLocalISO } from '../lib/time'
import ProfileMultiSelect from './ProfileMultiSelect'
import TimezonePicker from './TimezonePicker'
import Spinner from '../ui/Spinner'

export default function EventRow({ e, viewer, onShowLogs }) {
  const { updateEvent } = useEvents()
  const { profiles } = useProfiles()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [eventTz, setEventTz] = useState(e.eventTz)
  const [start, setStart] = useState(dayjs(e.startUtc).toDate())
  const [end, setEnd] = useState(dayjs(e.endUtc).toDate())
  const [profilesSel, setProfilesSel] = useState(e.profiles.map(p => p._id || p))

  // ✅ Reset state whenever edit mode opens
  useEffect(() => {
    if (editing) {
      setEventTz(e.eventTz)
      setStart(dayjs(e.startUtc).toDate())
      setEnd(dayjs(e.endUtc).toDate())
      setProfilesSel(e.profiles.map(p => p._id || p)) // Handles populated objects or IDs
    }
  }, [editing, e])

  const startInViewer = useMemo(() => fmtInTz(e.startUtc, viewer.timezone), [e.startUtc, viewer.timezone])
  const endInViewer   = useMemo(() => fmtInTz(e.endUtc, viewer.timezone), [e.endUtc, viewer.timezone])

  const onSave = async () => {
    setSaving(true)
    try {
      await updateEvent(e._id, {
        profiles: profilesSel,
        eventTz,
        startLocalISO: toLocalISO(start),
        endLocalISO: toLocalISO(end),
        updatedByProfile: viewer._id // ✅ Optional: log who updated
      }, viewer._id)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      {!editing ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600">
              Event TZ: <span className="font-mono">{e.eventTz}</span>
            </div>
            <div className="text-sm"><b>Start:</b> {startInViewer}</div>
            <div className="text-sm"><b>End:</b> {endInViewer}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn border" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn border" onClick={() => onShowLogs(e._id)}>View Logs</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ProfileMultiSelect
            profiles={profiles}
            selected={profilesSel}
            onChange={setProfilesSel}
            label="Assign to profiles"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TimezonePicker value={eventTz} onChange={setEventTz} label="Event timezone" />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Start</label>
              <DatePicker
                selected={start}
                onChange={setStart}
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                className="w-full rounded border p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">End</label>
              <DatePicker
                selected={end}
                onChange={setEnd}
                showTimeSelect
                timeIntervals={15}
                minDate={start}
                dateFormat="yyyy-MM-dd HH:mm"
                className="w-full rounded border p-2"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary disabled:opacity-50" onClick={onSave} disabled={saving}>
              {saving && <Spinner className="mr-2" />} Save
            </button>
            <button className="btn border" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}