import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Search,
  Plus,
  Lock,
  Globe,
  Play,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Repository } from '../types.ts';
import { api } from '../lib/api.ts';

interface RepositoriesPageProps {
  onNavigate: (path: string) => void;
  onOpenAddRepo: () => void;
}

export const RepositoriesPage: React.FC<RepositoriesPageProps> = ({ onNavigate, onOpenAddRepo }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const data = await api.getRepositories();
      setRepositories(data);
    } catch (err) {
      console.error('Failed to load repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const handleToggleAutomation = async (e: React.MouseEvent, repo: Repository) => {
    e.stopPropagation();
    setTogglingId(repo.id);
    try {
      if (repo.enabled) {
        await api.disableAutomation(repo.id);
      } else {
        await api.enableAutomation(repo.id);
      }
      await loadRepos();
    } catch (err: any) {
      alert(`Toggle failed: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = repositories.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'active') return r.enabled;
    if (filter === 'disabled') return !r.enabled;
    return true;
  });

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Repositories</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage repository automation configurations, strategies, and GitHub Actions workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadRepos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-neutral-900/60 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenAddRepo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Repository</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search managed repositories..."
            className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900/60 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-[#161F30] text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({repositories.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'active' ? 'bg-[#161F30] text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active ({repositories.filter((r) => r.enabled).length})
          </button>
          <button
            onClick={() => setFilter('disabled')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'disabled' ? 'bg-[#161F30] text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Disabled ({repositories.filter((r) => !r.enabled).length})
          </button>
        </div>
      </div>

      {/* Repositories List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-neutral-900/40 animate-pulse border border-white/[0.06]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-12 text-center space-y-3">
            <GitFork className="w-8 h-8 text-neutral-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No repositories found</div>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {search
                ? 'No repositories match your filter query.'
                : 'Connect a repository to start automating maintenance with GitPulse.'}
            </p>
            <button
              onClick={onOpenAddRepo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Repository</span>
            </button>
          </div>
        ) : (
          filtered.map((repo) => {
            const sched = repo.schedule;
            const isToggling = togglingId === repo.id;

            return (
              <div
                key={repo.id}
                onClick={() => onNavigate(`/repositories/${repo.id}`)}
                className="p-5 rounded-xl border border-white/[0.08] bg-[#0B0F19] hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {repo.fullName}
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
                    <span
                      className={`h-2 w-2 rounded-full inline-block ${
                        repo.enabled ? 'bg-emerald-400' : 'bg-neutral-600'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
                    <span className="text-neutral-300">{repo.maintenanceStrategy}</span>
                    <span>·</span>
                    <span>branch: {repo.branch}</span>
                    <span>·</span>
                    <span>
                      {sched ? `${sched.frequency || 'DAILY'} (${sched.cronExpression})` : 'Schedule paused'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => handleToggleAutomation(e, repo)}
                    disabled={isToggling}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      repo.enabled
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'border-white/[0.08] bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isToggling ? 'Updating...' : repo.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/repositories/${repo.id}`);
                    }}
                    className="p-1.5 rounded-lg border border-white/[0.08] bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Configure repository"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
