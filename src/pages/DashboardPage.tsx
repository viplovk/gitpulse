import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Zap,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Play,
  ArrowRight,
  Plus,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { Repository, Execution, DashboardMetrics } from '../types.ts';
import { api } from '../lib/api.ts';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onOpenAddRepo: () => void;
  onInspectExecution: (exec: Execution) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenAddRepo,
  onInspectExecution,
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRepositories: 0,
    activeAutomations: 0,
    runsThisWeek: 0,
    successRate: 100,
  });
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [m, repos, execs] = await Promise.all([
        api.getDashboardMetrics(),
        api.getRepositories(),
        api.getExecutions(15),
      ]);
      setMetrics(m);
      setRepositories(repos);
      setExecutions(execs);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRunTest = async (e: React.MouseEvent, repoId: string) => {
    e.stopPropagation();
    setRunningTestId(repoId);
    try {
      const exec = await api.triggerTestRun(repoId);
      await loadDashboardData();
      onInspectExecution(exec);
    } catch (err: any) {
      alert(`Test run error: ${err.message}`);
    } finally {
      setRunningTestId(null);
    }
  };

  const activeRepos = repositories.filter((r) => r.enabled);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">GitPulse</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Automated repository maintenance & execution telemetry</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
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

      {/* Top-Level Real Statistics Calculated from Database */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Repositories</span>
            <GitFork className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {metrics.totalRepositories}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            {metrics.activeAutomations} automated
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Jobs</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {metrics.activeAutomations}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            GitHub Actions scheduled
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Runs (7 Days)</span>
            <RotateCw className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {metrics.runsThisWeek}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Zero empty commits
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
            {metrics.successRate}%
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Exponential retry active
          </div>
        </div>
      </div>

      {/* Main Grid: Active Automations + Recent Executions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Automations Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Active Automations
            </h2>
            <button
              onClick={() => onNavigate('/schedules')}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] divide-y divide-white/[0.06] overflow-hidden">
            {activeRepos.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No active repository automations yet. Enable one below.
              </div>
            ) : (
              activeRepos.map((repo) => {
                const sched = repo.schedule;
                const freqText = sched?.frequency || 'DAILY';
                const timeText = sched?.hour !== undefined
                  ? `${String(sched.hour).padStart(2, '0')}:${String(sched.minute ?? 0).padStart(2, '0')} ${sched.timezone?.split('/')[1] || 'UTC'}`
                  : '21:00 IST';

                return (
                  <div
                    key={repo.id}
                    onClick={() => onNavigate(`/repositories/${repo.id}`)}
                    className="p-4 hover:bg-neutral-900/40 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {repo.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {repo.maintenanceStrategy}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1 font-mono">
                        <span className="text-emerald-400 font-semibold">{freqText}</span>
                        <span>·</span>
                        <span>{timeText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleRunTest(e, repo.id)}
                        disabled={runningTestId === repo.id}
                        title="Run test execution"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 text-[11px] text-neutral-200 hover:bg-emerald-500 hover:text-black font-medium transition-colors cursor-pointer"
                      >
                        <Play className={`w-3 h-3 ${runningTestId === repo.id ? 'animate-spin' : ''}`} />
                        <span>{runningTestId === repo.id ? 'Running...' : 'Run Test'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Executions Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Recent Executions
            </h2>
            <button
              onClick={() => onNavigate('/activity')}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] divide-y divide-white/[0.06] overflow-hidden">
            {executions.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                Your automation history will appear here once executed.
              </div>
            ) : (
              executions.slice(0, 7).map((exec) => {
                const isSuccess = exec.status === 'SUCCESS';
                const isSkipped = exec.status === 'SKIPPED';
                const isFailed = exec.status === 'FAILED';

                return (
                  <div
                    key={exec.id}
                    onClick={() => onInspectExecution(exec)}
                    className="p-4 hover:bg-neutral-900/40 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-3">
                      <div className="mt-0.5 shrink-0">
                        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isSkipped && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        {isFailed && <XCircle className="w-4 h-4 text-red-400" />}
                        {!isSuccess && !isSkipped && !isFailed && (
                          <Clock className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {exec.repository?.fullName || 'Repository'}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(exec.startedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-mono">
                          {exec.commitMessage || exec.errorMessage || 'Maintenance cycle executed'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                      <span className="text-[11px] text-neutral-400">
                        {exec.filesChanged} {exec.filesChanged === 1 ? 'file' : 'files'}
                      </span>
                      {exec.commitSha ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                          {exec.commitSha}
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
