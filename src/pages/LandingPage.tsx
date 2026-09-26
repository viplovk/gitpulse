import React, { useState } from 'react';
import {
  Github,
  ArrowRight,
  Shield,
  Clock,
  Terminal,
  FileCode,
  CheckCircle2,
  Calendar,
  Lock,
  GitCommit,
  Sparkles,
} from 'lucide-react';
import { User } from '../types.ts';

interface LandingPageProps {
  user: User | null;
  onOpenConnect: () => void;
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ user, onOpenConnect, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'changelog' | 'stats' | 'custom'>('daily');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 mb-6 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Legitimate GitHub Actions Automation · Zero Empty Commits
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight md:leading-[1.15]">
            Automate the maintenance your repositories actually need.
          </h1>

          <p className="mt-6 text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Connect GitHub, define repository maintenance, and let GitPulse handle the repetitive work through scheduled, native GitHub Actions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenConnect}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Github className="w-4 h-4" />
                <span>Connect GitHub</span>
              </button>
            )}

            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-neutral-900/60 px-6 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span>View how it works</span>
            </a>
          </div>
        </div>

        {/* Realistic Interactive Product Preview */}
        <div className="mx-auto max-w-5xl mt-14 rounded-xl border border-white/[0.08] bg-[#0B0F19] shadow-2xl overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-neutral-950/80 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
              </div>
              <span className="font-mono text-[11px] text-neutral-400 ml-2">gitpulse.dev / dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                6 repositories synchronized
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#090D16]/60">
            {/* Stat 1 */}
            <div className="p-4 rounded-lg border border-white/[0.06] bg-neutral-900/40">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-mono">Repositories</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">6</div>
              <div className="text-[11px] text-neutral-400 mt-1">4 active automations</div>
            </div>
            {/* Stat 2 */}
            <div className="p-4 rounded-lg border border-white/[0.06] bg-neutral-900/40">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-mono">Active Jobs</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">5</div>
              <div className="text-[11px] text-neutral-400 mt-1">Daily & weekly cadences</div>
            </div>
            {/* Stat 3 */}
            <div className="p-4 rounded-lg border border-white/[0.06] bg-neutral-900/40">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-mono">Runs This Week</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">43</div>
              <div className="text-[11px] text-neutral-400 mt-1">Zero empty commits</div>
            </div>
            {/* Stat 4 */}
            <div className="p-4 rounded-lg border border-white/[0.06] bg-neutral-900/40">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-mono">Success Rate</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">97.6%</div>
              <div className="text-[11px] text-neutral-400 mt-1">Auto-retrying transient 5xx</div>
            </div>
          </div>

          {/* Interactive preview row list */}
          <div className="p-6 border-t border-white/[0.06] bg-[#0B0F19]">
            <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">Recent Legitimate Executions</span>
              <span>All changes verified via git status --porcelain</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">viplovk/portfolio</div>
                    <div className="text-[11px] text-neutral-400 font-mono">chore: update daily log · 2 files changed</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">8f31c2a</span>
                  <span className="text-neutral-400">14.8s</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">viplovk/dsa-visualizer</div>
                    <div className="text-[11px] text-neutral-400 font-mono">docs: refresh documentation · 1 file changed</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">a91de72</span>
                  <span className="text-neutral-400">11.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How It Works */}
      <section id="how-it-works" className="px-6 py-20 border-b border-white/[0.06] bg-[#090D16]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">01. Architecture</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">How GitPulse Works</h2>
            <p className="text-sm text-neutral-400 mt-3">
              A transparent, developer-first pipeline designed to manage maintenance without magic or synthetic noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-semibold text-white">Connect GitHub</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Authenticate securely via GitHub OAuth. Access tokens are encrypted with AES-256-GCM before storage.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-semibold text-white">Select Repositories</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Discover private or public repositories. Pick branch targets, maintenance routines, and commit styles.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                3
              </div>
              <h3 className="text-sm font-semibold text-white">Generate Workflow</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                GitPulse creates a native <code className="text-emerald-300">gitpulse-maintenance.yml</code> workflow configured with your schedule.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                4
              </div>
              <h3 className="text-sm font-semibold text-white">Legitimate Commits</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                GitHub Actions runs scheduled checks. Commits only occur if genuine repository file diffs are verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Repository Automation Strategies */}
      <section className="px-6 py-20 border-b border-white/[0.06] bg-[#0B0F19]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">02. Strategies</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Real Repository Maintenance</h2>
            <p className="text-sm text-neutral-400 mt-3">
              Four concrete strategies to maintain project health, activity records, and telemetry without artificial green squares.
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              Daily Log
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'changelog'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              Changelog
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              Repository Stats
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              Custom Script
            </button>
          </div>

          {/* Strategy Details Box */}
          <div className="rounded-xl border border-white/[0.08] bg-black p-6 font-mono text-xs">
            {activeTab === 'daily' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400 pb-3 border-b border-white/[0.08]">
                  <span>File: DAILY.md</span>
                  <span className="text-emerald-400">Duplicate Check: Enabled</span>
                </div>
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto">
{`# Daily Repository Log

## 2026-09-26

- Automated repository maintenance completed.
- Repository metadata refreshed.

// GitPulse checks if today's date exists before writing.
// If already present, execution is SKIPPED with zero empty commits.`}
                </pre>
              </div>
            )}

            {activeTab === 'changelog' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400 pb-3 border-b border-white/[0.08]">
                  <span>File: CHANGELOG.md</span>
                  <span className="text-emerald-400">Semantic Versioning Sync</span>
                </div>
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto">
{`# Changelog

All notable maintenance updates are documented here.

## [2026-09-26] - Maintenance
- Scheduled dependency audit & repo synchronization completed.`}
                </pre>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400 pb-3 border-b border-white/[0.08]">
                  <span>File: .github/gitpulse/stats.json</span>
                  <span className="text-emerald-400">Tree Scan: Git ls-files</span>
                </div>
                <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
{`{
  "updatedAt": "2026-09-26T15:30:00Z",
  "fileCount": 124,
  "directoryCount": 21,
  "generator": "GitPulse Automation"
}`}
                </pre>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400 pb-3 border-b border-white/[0.08]">
                  <span>File: .github/gitpulse/maintenance.sh</span>
                  <span className="text-emerald-400">Runner Permission: Explicit Opt-in</span>
                </div>
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto">
{`#!/usr/bin/env bash
set -euo pipefail

echo "Running custom repository hygiene script..."
# Run linter, prune temp cache, rebuild index
npm audit fix --package-lock-only || true
echo "Maintenance script completed."`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Timezone-Aware Scheduling */}
      <section className="px-6 py-20 border-b border-white/[0.06] bg-[#090D16]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">03. Scheduling</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
                Timezone-Aware Cron Translation
              </h2>
              <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
                GitHub Actions cron uses UTC. GitPulse allows you to pick your exact local timezone (e.g. Asia/Kolkata, America/New_York) and local hour, then mathematically derives the matching UTC schedule.
              </p>
              <div className="mt-6 space-y-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dual display: 21:00 IST and 15:30 UTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cadences: Daily, Weekdays, Weekly, or Custom Cron</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Idempotency key prevents duplicate runs in the same period</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-white">Schedule Preview</span>
                <span className="text-xs font-mono text-emerald-400">Next: Tomorrow 21:00 IST</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400">Frequency:</span>
                  <span className="font-semibold text-white">Every day</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400">Local Time:</span>
                  <span className="font-mono text-white">21:00 (Asia/Kolkata)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400">GitHub Actions Cron:</span>
                  <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">30 15 * * *</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400">Runner UTC Equivalent:</span>
                  <span className="font-mono text-neutral-300">15:30 UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Strict No-Empty-Commits Guarantee */}
      <section className="px-6 py-20 border-b border-white/[0.06] bg-[#0B0F19]">
        <div className="mx-auto max-w-5xl text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">04. Integrity</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Zero Empty Commits</h2>
            <p className="text-sm text-neutral-400 mt-3">
              We reject fake contribution inflation. Every commit must correspond to a verified, meaningful repository file diff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
              <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Banned Behavior</div>
              <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                $ git commit --allow-empty -m "daily bot commit"
              </p>
              <p className="text-xs text-neutral-400">
                Artificial empty commits clutter git history, degrade repository credibility, and violate developer ethics.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">GitPulse Standard</div>
              <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                $ if git status --porcelain; then commit; else record SKIPPED; fi
              </p>
              <p className="text-xs text-neutral-400">
                If no files change or if today's entry already exists, the run is recorded as <strong className="text-amber-400">SKIPPED</strong>. No commit is pushed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Security Architecture */}
      <section className="px-6 py-20 border-b border-white/[0.06] bg-[#090D16]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">05. Security</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Enterprise-Grade Token Hygiene</h2>
            <p className="text-sm text-neutral-400 mt-3">
              Sensitive GitHub credentials never reach browser memory, URLs, or client bundles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">AES-256-GCM Encryption</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tokens are encrypted server-side with authenticated GCM ciphers. Client responses only receive connection status.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">SameSite=None & Secure Cookies</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hardened HTTP-only session cookies designed specifically for cross-origin iframe security without third-party exposure.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-neutral-900/30 space-y-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Zero Token Logging</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Workflow dispatches prefer native repository runner tokens. Secrets are purged from all action execution streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="px-6 py-24 bg-[#0B0F19] text-center relative overflow-hidden">
        <div className="mx-auto max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ready to streamline repository maintenance?
          </h2>
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
            Connect your GitHub account in seconds. Configure automated schedules, inspect execution logs, and keep repositories healthy.
          </p>

          <div className="mt-8 flex justify-center">
            {user ? (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenConnect}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>Connect GitHub</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Clean Footer (Anti-slop: quiet links, no fake engines) */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#090D16] py-6 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">GitPulse</span>
            <span>·</span>
            <span>Automated GitHub repository maintenance</span>
          </div>
          <div>© {new Date().getFullYear()} GitPulse. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
