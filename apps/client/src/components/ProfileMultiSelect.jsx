import CreatableSelect from 'react-select/creatable'
import toast from 'react-hot-toast'
import { useProfiles } from '../store/profiles'

export default function ProfileMultiSelect({ profiles, selected, onChange, label = 'Profiles' }) {
  const { createProfile } = useProfiles()

  const options = profiles.map((p) => ({
    value: p._id,
    label: `${p.name} (${p.timezone})` // ✅ Show timezone for clarity
  }))
  const value = options.filter((o) => selected.includes(o.value))

  const handleCreate = async (inputValue) => {
    const name = (inputValue || '').trim()
    if (!name) return
    const exists = profiles.some(p => p.name.toLowerCase() === name.toLowerCase())
    if (exists) return toast.error(`"${name}" already exists`)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    try {
      const p = await createProfile(name, tz)
      onChange([...selected, p._id]) // ✅ Auto-select new profile
    } catch { /* toast handled */ }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <CreatableSelect
        isMulti
        options={options}
        value={value}
        onChange={(items) => onChange(items.map((i) => i.value))}
        onCreateOption={handleCreate}
        classNamePrefix="react-select"
        placeholder="Select or type to create"
      />
      <p className="text-xs text-slate-500">Type a name and press Enter to add a profile.</p>
    </div>
  )
}