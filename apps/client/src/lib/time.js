import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

/** Convert UTC date/time (string/Date) to viewerTZ string */
export function fmtInTz(utcValue, viewerTz, fmt = 'YYYY-MM-DD HH:mm') {
  return dayjs.utc(utcValue).tz(viewerTz).format(fmt)
}

/** Local ISO for event timezone (forms send these to backend) */
export function toLocalISO(dateObj) {
  return dayjs(dateObj).format('YYYY-MM-DDTHH:mm')
}