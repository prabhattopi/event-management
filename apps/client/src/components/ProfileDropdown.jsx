import { useEffect, useMemo, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import TimezonePicker from './TimezonePicker'
import { useProfiles } from '../store/profiles'
import toast from 'react-hot-toast'

export default function ProfileDropdown({ viewerProfileId, setViewerProfileId }) {
  const { profiles, fetchProfiles, createProfile, updateProfileTimezone } = useProfiles()
  const [editingTz, setEditingTz] = useState(false)
  const viewer = useMemo(() => profiles.find(p => p._id === viewerProfileId), [profiles, viewerProfileId])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  const options = profiles.map(p => ({
    value: p._id,
    label: `${p.name} (${p.timezone})` // ✅ Show timezone in dropdown
  }))
  const value = options.find(o => o.value === viewerProfileId) || null

  const onCreate = async (inputValue) => {
    const name = (inputValue || '').trim()
    if (!name) return
    const exists = profiles.some(p => p.name.toLowerCase() === name.toLowerCase())
    if (exists) return toast.error(`"${name}" already exists`)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    try {
      const p = await createProfile(name, tz)
      setViewerProfileId(p._id)
    } catch {}
  }

  const onChange = (opt) => setViewerProfileId(opt?.value || '')

  return (
    <div className="flex items-center gap-3">
      <CreatableSelect
        className="min-w-[260px]"
        classNamePrefix="react-select"
        placeholder="Viewer profile"
        options={options}
        value={value}
        onChange={onChange}
        onCreateOption={onCreate}
      />
      {viewer && (
        <button
          className="btn border"
          onClick={() => setEditingTz((v) => !v)}
          title="Edit viewer timezone"
        >
          Edit TZ
        </button>
      )}
      {editingTz && viewer && (
        <div className="absolute right-4 top-16 z-20 card w-[320px]">
          <div className="text-sm mb-2 font-medium">Change Timezone for {viewer.name}</div>
          <TimezonePicker
            value={viewer.timezone}
            onChange={async (tz) => {
              try {
                await updateProfileTimezone(viewer._id, tz)
                toast.success('Viewer timezone updated')
                setEditingTz(false)
              } catch {}
            }}
          />
        </div>
      )}
    </div>
  )
}