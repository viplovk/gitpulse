import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Clock, Copy, Check, GitCommit, FileCode, Terminal } from 'lucide-react';
import { Execution } from '../types.ts';

interface ExecutionDetailModalProps {
  execution: Execution | null;
  onClose: () => void;
}

export const ExecutionDetailModal: React.FC<ExecutionDetailModalProps> = ({ execution, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!execution) return null;

  const copyLogs = () => {
    if (execution.logs) {
      navigator.clipboard.writeText(execution.logs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Success
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> Skipped (No Changes)
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium animate-pulse">
            <Clock className="w-3.5 h-3.5 animate-spin" /> Running
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

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

        {/* Header */}
        <div className="flex items-start justify-between pr-8 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-white tracking-tight">
                {execution.repository?.fullName || 'Repository Execution'}
              </h3>
              {getStatusBadge(execution.status)}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 tabular-nums">
              <span>Started: {new Date(execution.startedAt).toLocaleTimeString()}</span>
              <span>·</span>
              <span>Duration: {execution.durationSeconds ? `${execution.durationSeconds}s` : 'In progress'}</span>
              <span>·</span>
              <span>Retries: {execution.retryCount}</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border border-white/[0.06] bg-neutral-900/40 p-3">
            <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-neutral-400" />
              Commit SHA
            </div>
            <div className="font-mono text-xs text-white">
              {execution.commitSha ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {execution.commitSha}
                </span>
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-neutral-900/40 p-3">
            <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-neutral-400" />
              Files Changed
            </div>
            <div className="text-xs font-medium text-white tabular-nums">
              {execution.filesChanged} {execution.filesChanged === 1 ? 'file' : 'files'}
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-neutral-900/40 p-3">
            <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              Finished At
            </div>
            <div className="text-xs text-neutral-300 tabular-nums">
              {execution.finishedAt ? new Date(execution.finishedAt).toLocaleTimeString() : 'Running...'}
            </div>
          </div>
        </div>

        {execution.commitMessage && (
          <div className="mb-4 rounded-lg border border-white/[0.06] bg-neutral-950 p-3 text-xs">
            <span className="text-neutral-400 block mb-1">Commit Message:</span>
            <span className="font-mono text-emerald-300">{execution.commitMessage}</span>
          </div>
        )}

        {execution.errorMessage && (
          <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
            <div className="font-medium mb-0.5">Execution Notice:</div>
            <div className="text-neutral-300">{execution.errorMessage}</div>
          </div>
        )}

        {/* Terminal Logs */}
        <div className="flex-1 flex flex-col min-h-[220px] rounded-lg border border-white/[0.08] bg-black overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-neutral-950 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Actions Execution Output</span>
            </div>
            <button
              onClick={copyLogs}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed space-y-1">
            {execution.logs ? (
              execution.logs.split('\n').map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  {line.startsWith('[Error]') ? (
                    <span className="text-red-400">{line}</span>
                  ) : line.includes('SUCCESS') ? (
                    <span className="text-emerald-400 font-semibold">{line}</span>
                  ) : line.includes('SKIPPED') ? (
                    <span className="text-amber-400 font-semibold">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-neutral-500">No execution logs recorded yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
