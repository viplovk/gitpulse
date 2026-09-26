export interface ScheduleConfig {
  frequency: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM';
  hour: number;        // 0-23 in specified timezone
  minute: number;      // 0-59 in specified timezone
  dayOfWeek?: number;  // 0-6 (0=Sunday) for WEEKLY
  timezone: string;    // e.g. "Asia/Kolkata", "America/New_York", "UTC"
  customCron?: string; // used when frequency is CUSTOM
}

// Convert local hour/minute in a timezone to UTC hour/minute
export function convertTimeToUtc(hour: number, minute: number, timezone: string): { utcHour: number; utcMinute: number; dayOffset: number } {
  try {
    const now = new Date();
    // Build a date string with the specified time for today
    const dateStr = now.toISOString().slice(0, 10);
    const targetStr = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    
    // Find the offset using Intl.DateTimeFormat
    const targetDate = new Date(targetStr);
    
    // Format targetDate in target timezone to see local representation
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    // Approximate offset calculation
    // Create UTC date and test difference
    const sampleDate = new Date();
    const utcParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(sampleDate);

    const tzParts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(sampleDate);

    const getVal = (parts: Intl.DateTimeFormatPart[], type: string) => {
      const p = parts.find((x) => x.type === type);
      return p ? parseInt(p.value, 10) : 0;
    };

    const utcMinutesTotal = getVal(utcParts, 'hour') * 60 + getVal(utcParts, 'minute');
    const tzMinutesTotal = getVal(tzParts, 'hour') * 60 + getVal(tzParts, 'minute');
    let offsetMinutes = tzMinutesTotal - utcMinutesTotal;
    
    // Handle midnight boundary in offset calculation
    if (offsetMinutes > 720) offsetMinutes -= 1440;
    if (offsetMinutes < -720) offsetMinutes += 1440;

    let targetTotalMinutes = hour * 60 + minute - offsetMinutes;
    let dayOffset = 0;
    
    while (targetTotalMinutes < 0) {
      targetTotalMinutes += 1440;
      dayOffset -= 1;
    }
    while (targetTotalMinutes >= 1440) {
      targetTotalMinutes -= 1440;
      dayOffset += 1;
    }

    const utcHour = Math.floor(targetTotalMinutes / 60);
    const utcMinute = targetTotalMinutes % 60;

    return { utcHour, utcMinute, dayOffset };
  } catch (err) {
    console.error('Error calculating timezone offset, falling back to UTC:', err);
    return { utcHour: hour, utcMinute: minute, dayOffset: 0 };
  }
}

/**
 * Generate GitHub Actions UTC cron string from user configuration.
 */
export function generateCronExpression(config: ScheduleConfig): string {
  if (config.frequency === 'CUSTOM' && config.customCron) {
    return config.customCron.trim();
  }

  const { utcHour, utcMinute, dayOffset } = convertTimeToUtc(config.hour, config.minute, config.timezone);

  switch (config.frequency) {
    case 'DAILY':
      return `${utcMinute} ${utcHour} * * *`;
    case 'WEEKDAYS':
      // 1-5 is Mon-Fri. If dayOffset shifts it:
      return `${utcMinute} ${utcHour} * * 1-5`;
    case 'WEEKLY': {
      let dow = (config.dayOfWeek ?? 0) + dayOffset;
      if (dow < 0) dow = 6;
      if (dow > 6) dow = 0;
      return `${utcMinute} ${utcHour} * * ${dow}`;
    }
    default:
      return `${utcMinute} ${utcHour} * * *`;
  }
}

/**
 * Returns human readable display of the local schedule and UTC schedule.
 */
export function formatScheduleDisplay(config: ScheduleConfig): { localText: string; utcText: string; cron: string } {
  const cron = generateCronExpression(config);
  const { utcHour, utcMinute } = convertTimeToUtc(config.hour, config.minute, config.timezone);
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const localTime = `${pad(config.hour)}:${pad(config.minute)}`;
  const utcTime = `${pad(utcHour)}:${pad(utcMinute)} UTC`;

  const tzShort = getTzAbbreviation(config.timezone);

  let freqText = 'Daily';
  if (config.frequency === 'WEEKDAYS') freqText = 'Weekdays (Mon-Fri)';
  if (config.frequency === 'WEEKLY') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    freqText = `Weekly (${days[config.dayOfWeek ?? 0]})`;
  }
  if (config.frequency === 'CUSTOM') freqText = `Custom (${config.customCron})`;

  return {
    localText: `${freqText} at ${localTime} ${tzShort}`,
    utcText: `${utcTime}`,
    cron,
  };
}

export function getTzAbbreviation(timezone: string): string {
  try {
    const date = new Date();
    const str = date.toLocaleTimeString('en-US', { timeZone: timezone, timeZoneName: 'short' });
    const parts = str.split(' ');
    return parts[parts.length - 1] || timezone;
  } catch {
    return timezone;
  }
}

/**
 * Calculates next expected execution timestamp
 */
export function calculateNextRunAt(cronExpression: string): Date {
  const parts = cronExpression.split(' ');
  const minute = parseInt(parts[0], 10) || 0;
  const hour = parseInt(parts[1], 10) || 0;
  
  const now = new Date();
  const next = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hour,
    minute,
    0,
    0
  ));

  if (next.getTime() <= now.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  return next;
}
