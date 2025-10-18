export function diffEvent(prev, next) {
    const fields = [
      'profiles', 'eventTz', 'startUtc', 'endUtc',
    ]
    const changes = []
    for (const f of fields) {
      const oldV = serialize(prev[f])
      const newV = serialize(next[f])
      if (!isEqual(oldV, newV)) {
        changes.push({ field: f, old: oldV, new: newV })
      }
    }
    return changes
  }
  
  function serialize(v) {
    if (Array.isArray(v)) {
      return v.map(String).sort()
    }
    if (v instanceof Date) return v.toISOString()
    if (v && typeof v === 'object') return JSON.stringify(v)
    return v === undefined ? null : v
  }
  
  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }