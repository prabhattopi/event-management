import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// Convert local ISO string in event timezone to UTC Date
export const toUtc = (localISO, tz) => dayjs.tz(localISO, tz).utc().toDate();