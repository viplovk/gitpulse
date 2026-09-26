import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Globe, ArrowRight } from 'lucide-react';
import { Schedule } from '../types.ts';
import { api } from '../lib/api.ts';

interface ScheduleModalProps {
  isOpen: boolean;
  repositoryId: string;
  currentSchedule?: Schedule | null;
  onClose: () => void;
  onSaved: (schedule: Schedule) => void;
}

const COMMON_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST - UTC+5:30)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT - UTC-5/UTC-4)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT - UTC-8/UTC-7)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT - UTC-6/UTC-5)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST - UTC+0/UTC+1)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST - UTC+1/UTC+2)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST - UTC+9:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT - UTC+8:00)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST - UTC+10:00)' },
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  repositoryId,
  currentSchedule,
  onClose,
  onSaved,
}) => {
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM'>('DAILY');
  const [hour, setHour] = useState(21);
  const [minute, setMinute] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [customCron, setCustomCron] = useState('0 0 * * *');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentSchedule) {
      setFrequency(currentSchedule.frequency || 'DAILY');
      setHour(currentSchedule.hour ?? 21);
      setMinute(currentSchedule.minute ?? 0);
      setDayOfWeek(currentSchedule.dayOfWeek ?? 0);
      setTimezone(currentSchedule.timezone || 'Asia/Kolkata');
      if (currentSchedule.cronExpression) setCustomCron(currentSchedule.cronExpression);
    }
  }, [currentSchedule, isOpen]);

  if (!isOpen) return null;

  // Simple local timezone offset preview calculation
  const getUtcPreview = () => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const targetStr = `${todayStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
      
      const sample = new Date(targetStr);
      // Rough offset calculation for display
      const dateInTz = new Date(sample.toLocaleString('en-US', { timeZone: timezone }));
      const dateInUtc = new Date(sample.toLocaleString('en-US', { timeZone: 'UTC' }));
      const diffMinutes = Math.round((dateInTz.getTime() - dateInUtc.getTime()) / 60000);

      let targetTotal = hour * 60 + minute - diffMinutes;
      while (targetTotal < 0) targetTotal += 1440;
      while (targetTotal >= 1440) targetTotal -= 1440;

      const utcHour = Math.floor(targetTotal / 60);
      const utcMinute = targetTotal % 60;
      return `${String(utcHour).padStart(2, '0')}:${String(utcMinute).padStart(2, '0')} UTC`;
    } catch {
      return 'Calculating UTC...';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateSchedule(repositoryId, {
        frequency,
        hour: Number(hour),
        minute: Number(minute),
        dayOfWeek: Number(dayOfWeek),
        timezone,
        customCron: frequency === 'CUSTOM' ? customCron : undefined,
      });
      onSaved(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update schedule.');
    } finally {
      setSaving(false);
    }
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-xl border border-white/[0.08] bg-[#0B0F19] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 border border-white/[0.08] text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Configure Schedule</h3>
            <p className="text-xs text-neutral-400">Automated GitHub Actions maintenance frequency</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Frequency */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="DAILY">Every day</option>
              <option value="WEEKDAYS">Weekdays (Monday – Friday)</option>
              <option value="WEEKLY">Weekly (Once per week)</option>
              <option value="CUSTOM">Custom cron expression</option>
            </select>
          </div>

          {frequency === 'WEEKLY' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          )}

          {frequency === 'CUSTOM' ? (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Cron Expression (UTC)</label>
              <input
                type="text"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="30 15 * * *"
                className="w-full font-mono rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                required
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">GitHub Actions cron schedule format</span>
            </div>
          ) : (
            <>
              {/* Time */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Execution Time</span>
                  <span className="text-[11px] text-neutral-500">24-hour format</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <select
                      value={hour}
                      onChange={(e) => setHour(parseInt(e.target.value, 10))}
                      className="w-full font-mono rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>{pad(i)} hrs</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-neutral-500 font-mono">:</span>
                  <div className="flex-1">
                    <select
                      value={minute}
                      onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                      className="w-full font-mono rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value={0}>00 mins</option>
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Timezone Conversion Box */}
          <div className="rounded-lg border border-white/[0.06] bg-neutral-900/60 p-3 text-xs space-y-1.5">
            <div className="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">
              Timezone Sync & UTC Translation
            </div>
            <div className="flex items-center justify-between text-neutral-200">
              <span className="font-mono text-white">
                {pad(hour)}:{pad(minute)} ({timezone.split('/')[1] || timezone})
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-mono text-emerald-400 font-semibold">{getUtcPreview()}</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              GitHub Actions runners execute in UTC. GitPulse automatically syncs your local schedule with GitHub cron.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
