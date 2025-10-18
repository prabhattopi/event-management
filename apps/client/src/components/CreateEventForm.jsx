import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

import { useProfiles } from '../store/profiles'
import { useEvents } from '../store/events'
import ProfileMultiSelect from './ProfileMultiSelect'
import TimezonePicker from './TimezonePicker'
import { toLocalISO } from '../lib/time'

export default function CreateEventForm({ viewerProfileId }) {
  const { profiles, fetchProfiles } = useProfiles()
  const { createEvent } = useEvents()
  const [profilesSel, setProfilesSel] = useState([])
  const [eventTz, setEventTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(dayjs().add(1, 'hour').toDate())

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  useEffect(() => {
    if (dayjs(end).isBefore(dayjs(start))) {
      setEnd(dayjs(start).add(1, 'hour').toDate())
    }
  }, [start]) // eslint-disable-line

  const canSubmit = useMemo(() =>
    profilesSel.length && eventTz && start && end && !dayjs(end).isBefore(dayjs(start)),
    [profilesSel, eventTz, start, end]
  )

  const submit = async (e) => {
    e.preventDefault()
    await createEvent({
      profiles: profilesSel,
      eventTz,
      startLocalISO: toLocalISO(start),
      endLocalISO: toLocalISO(end),
    }, viewerProfileId)
    setProfilesSel([])
    setStart(new Date())
    setEnd(dayjs().add(1, 'hour').toDate())
  }

  return (
    <form onSubmit={submit} className="card">
      <h3 className="text-lg font-semibold">Create Event</h3>
      <p className="text-xs text-slate-500">Start/End are entered in the selected <b>Event timezone</b>.</p>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <ProfileMultiSelect
          profiles={profiles}
          selected={profilesSel}
          onChange={setProfilesSel}
          label="Assign to profiles"
        />
        <TimezonePicker value={eventTz} onChange={setEventTz} label="Event timezone" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" disabled={!canSubmit}>+ Create Event</button>
      </div>
    </form>
  )
}