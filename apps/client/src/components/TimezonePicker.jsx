import TimezoneSelect from 'react-timezone-select'

export default function TimezonePicker({ value, onChange, label = 'Timezone' }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <TimezoneSelect
        value={value}
        onChange={(opt) => onChange(typeof opt === 'string' ? opt : opt?.value)}
      />
    </div>
  )
}