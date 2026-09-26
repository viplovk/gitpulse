import React, { useState, useEffect } from 'react';
import { X, Search, GitBranch, Lock, Globe, FileText, Check, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { GithubRepoItem, MaintenanceStrategy } from '../types.ts';
import { api } from '../lib/api.ts';

interface AddRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const AddRepoModal: React.FC<AddRepoModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [repos, setRepos] = useState<GithubRepoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GithubRepoItem | null>(null);

  // Configuration form state
  const [strategy, setStrategy] = useState<MaintenanceStrategy>('DAILY_LOG');
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('chore: automated repository maintenance');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'WEEKDAYS'>('DAILY');
  const [hour, setHour] = useState(21);
  const [minute, setMinute] = useState(0);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRepos();
    }
  }, [isOpen]);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGithubAvailableRepos();
      setRepos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repositories. Ensure GitHub is connected.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (repo: GithubRepoItem) => {
    setSelectedRepo(repo);
    setBranch(repo.default_branch || 'main');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.addRepository({
        githubRepoId: selectedRepo.id,
        owner: selectedRepo.owner.login,
        name: selectedRepo.name,
        fullName: selectedRepo.full_name,
        defaultBranch: selectedRepo.default_branch,
        private: selectedRepo.private,
        maintenanceStrategy: strategy,
        branch,
        commitMessageStyle: commitMessage,
        executionMode: 'DIRECT_COMMIT',
        schedule: {
          frequency,
          hour: Number(hour),
          minute: Number(minute),
          timezone,
        },
      });

      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add repository.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredRepos = repos.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl rounded-xl border border-white/[0.08] bg-[#0B0F19] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white tracking-tight">Add Repository to GitPulse</h3>
          <p className="text-xs text-neutral-400">
            {selectedRepo
              ? `Configuring maintenance for ${selectedRepo.full_name}`
              : 'Select a repository from your connected GitHub account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {!selectedRepo ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter repositories..."
                  className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
              <button
                onClick={loadRepos}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-neutral-900 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px]">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-neutral-900/60 animate-pulse" />
                  ))}
                </div>
              ) : filteredRepos.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No repositories found matching your search.
                </div>
              ) : (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => handleSelect(repo)}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-neutral-900/40 hover:bg-neutral-900 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {repo.full_name}
                        </span>
                        {repo.private ? (
                          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                            <Lock className="w-3 h-3" /> private
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                            <Globe className="w-3 h-3" /> public
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                        {repo.language && <span>{repo.language}</span>}
                        <span>·</span>
                        <span>{repo.default_branch}</span>
                        <span>·</span>
                        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-800 text-xs text-neutral-200 group-hover:bg-emerald-500 group-hover:text-black font-medium transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Select
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.08] bg-neutral-900/60">
              <div>
                <span className="text-xs font-medium text-white block">{selectedRepo.full_name}</span>
                <span className="text-[11px] text-neutral-400">Default branch: {selectedRepo.default_branch}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRepo(null)}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Maintenance Strategy Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Maintenance Strategy</label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setStrategy('DAILY_LOG')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    strategy === 'DAILY_LOG'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-neutral-900/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Daily Log</span>
                    {strategy === 'DAILY_LOG' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Appends dated entry to <code className="text-neutral-300">DAILY.md</code> without duplicates.
                  </p>
                </div>

                <div
                  onClick={() => setStrategy('CHANGELOG')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    strategy === 'CHANGELOG'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-neutral-900/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Changelog</span>
                    {strategy === 'CHANGELOG' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Maintains dated section in <code className="text-neutral-300">CHANGELOG.md</code>.
                  </p>
                </div>

                <div
                  onClick={() => setStrategy('STATS_JSON')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    strategy === 'STATS_JSON'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-neutral-900/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Repository Stats</span>
                    {strategy === 'STATS_JSON' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Computes file & dir metrics to <code className="text-neutral-300">stats.json</code>.
                  </p>
                </div>

                <div
                  onClick={() => setStrategy('CUSTOM_SCRIPT')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    strategy === 'CUSTOM_SCRIPT'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-neutral-900/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Custom Script</span>
                    {strategy === 'CUSTOM_SCRIPT' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Runs <code className="text-neutral-300">.github/gitpulse/maintenance.sh</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Branch & Commit Message */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Target Branch</label>
                <div className="relative">
                  <GitBranch className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 pl-8 pr-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Commit Message</label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 pl-8 pr-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="rounded-lg border border-white/[0.06] bg-neutral-900/40 p-3 space-y-3">
              <span className="text-xs font-medium text-neutral-300 block">Initial Schedule</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Cadence</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKDAYS">Weekdays</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Time</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={hour}
                      onChange={(e) => setHour(parseInt(e.target.value, 10))}
                      className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-1 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden truncate"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRepo(null)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Adding Repository...' : 'Enable Maintenance'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
