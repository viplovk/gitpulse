import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { encryptToken } from './crypto.ts';

export interface User {
  id: string;
  githubUserId: string;
  username: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubAccount {
  id: string;
  userId: string;
  githubUserId: string;
  username: string;
  encryptedAccessToken: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceStrategy = 'DAILY_LOG' | 'CHANGELOG' | 'STATS_JSON' | 'CUSTOM_SCRIPT';

export interface Repository {
  id: string;
  githubAccountId: string;
  githubRepoId: number;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  enabled: boolean;
  maintenanceStrategy: MaintenanceStrategy;
  branch: string;
  commitMessageStyle: string;
  executionMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  repositoryId: string;
  cronExpression: string;
  timezone: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM';
  hour?: number;
  minute?: number;
  dayOfWeek?: number;
  enabled: boolean;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus = 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'SKIPPED' | 'FAILED' | 'RETRYING';

export interface Execution {
  id: string;
  repositoryId: string;
  scheduleId?: string | null;
  status: ExecutionStatus;
  startedAt: string;
  finishedAt?: string | null;
  durationSeconds?: number;
  commitSha?: string | null;
  commitMessage?: string | null;
  filesChanged: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  retryCount: number;
  logs?: string | null;
  createdAt: string;
}

interface DBData {
  users: User[];
  githubAccounts: GitHubAccount[];
  repositories: Repository[];
  schedules: Schedule[];
  executions: Execution[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'gitpulse-db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialData(): DBData {
  const userId = 'usr_viplovk_dev';
  const ghAccountId = 'gha_viplovk';
  const now = new Date();
  const mockToken = encryptToken('ghp_mock_demo_access_token_for_initial_exploration');

  const initialUser: User = {
    id: userId,
    githubUserId: '7392104',
    username: 'viplovk',
    avatarUrl: 'https://avatars.githubusercontent.com/u/7392104?v=4',
    createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(),
    updatedAt: now.toISOString(),
  };

  const initialAccount: GitHubAccount = {
    id: ghAccountId,
    userId,
    githubUserId: '7392104',
    username: 'viplovk',
    encryptedAccessToken: mockToken,
    createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(),
    updatedAt: now.toISOString(),
  };

  const initialRepos: Repository[] = [
    {
      id: 'repo_portfolio',
      githubAccountId: ghAccountId,
      githubRepoId: 8192014,
      owner: 'viplovk',
      name: 'portfolio',
      fullName: 'viplovk/portfolio',
      defaultBranch: 'main',
      private: false,
      enabled: true,
      maintenanceStrategy: 'DAILY_LOG',
      branch: 'main',
      commitMessageStyle: 'chore: update daily log',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 14).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'repo_dsa_visualizer',
      githubAccountId: ghAccountId,
      githubRepoId: 8192015,
      owner: 'viplovk',
      name: 'dsa-visualizer',
      fullName: 'viplovk/dsa-visualizer',
      defaultBranch: 'main',
      private: false,
      enabled: true,
      maintenanceStrategy: 'CHANGELOG',
      branch: 'main',
      commitMessageStyle: 'docs: refresh documentation',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'repo_experiments',
      githubAccountId: ghAccountId,
      githubRepoId: 8192016,
      owner: 'viplovk',
      name: 'experiments',
      fullName: 'viplovk/experiments',
      defaultBranch: 'main',
      private: true,
      enabled: true,
      maintenanceStrategy: 'STATS_JSON',
      branch: 'main',
      commitMessageStyle: 'chore: update repository stats',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'repo_cloud_telemetry',
      githubAccountId: ghAccountId,
      githubRepoId: 8192017,
      owner: 'viplovk',
      name: 'cloud-telemetry',
      fullName: 'viplovk/cloud-telemetry',
      defaultBranch: 'main',
      private: false,
      enabled: true,
      maintenanceStrategy: 'DAILY_LOG',
      branch: 'main',
      commitMessageStyle: 'chore: record automated daily maintenance',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'repo_infra_manifests',
      githubAccountId: ghAccountId,
      githubRepoId: 8192018,
      owner: 'viplovk',
      name: 'infra-manifests',
      fullName: 'viplovk/infra-manifests',
      defaultBranch: 'main',
      private: true,
      enabled: true,
      maintenanceStrategy: 'CUSTOM_SCRIPT',
      branch: 'main',
      commitMessageStyle: 'ci: execute scheduled repo sanity check',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'repo_react_patterns',
      githubAccountId: ghAccountId,
      githubRepoId: 8192019,
      owner: 'viplovk',
      name: 'react-design-patterns',
      fullName: 'viplovk/react-design-patterns',
      defaultBranch: 'main',
      private: false,
      enabled: false,
      maintenanceStrategy: 'CHANGELOG',
      branch: 'main',
      commitMessageStyle: 'docs: automated changelog synchronization',
      executionMode: 'DIRECT_COMMIT',
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  const initialSchedules: Schedule[] = [
    {
      id: 'sched_portfolio',
      repositoryId: 'repo_portfolio',
      cronExpression: '30 15 * * *', // 21:00 IST = 15:30 UTC
      timezone: 'Asia/Kolkata',
      frequency: 'DAILY',
      hour: 21,
      minute: 0,
      enabled: true,
      nextRunAt: new Date(now.getTime() + 3600000 * 12).toISOString(),
      lastRunAt: new Date(now.getTime() - 3600000 * 10).toISOString(),
      createdAt: new Date(now.getTime() - 86400000 * 14).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'sched_dsa_visualizer',
      repositoryId: 'repo_dsa_visualizer',
      cronExpression: '0 16 * * *', // 21:30 IST = 16:00 UTC
      timezone: 'Asia/Kolkata',
      frequency: 'DAILY',
      hour: 21,
      minute: 30,
      enabled: true,
      nextRunAt: new Date(now.getTime() + 3600000 * 12.5).toISOString(),
      lastRunAt: new Date(now.getTime() - 3600000 * 9.5).toISOString(),
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'sched_experiments',
      repositoryId: 'repo_experiments',
      cronExpression: '0 18 * * 0', // Weekly Sunday
      timezone: 'Asia/Kolkata',
      frequency: 'WEEKLY',
      dayOfWeek: 0,
      hour: 23,
      minute: 30,
      enabled: true,
      nextRunAt: new Date(now.getTime() + 86400000 * 3).toISOString(),
      lastRunAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      createdAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'sched_cloud_telemetry',
      repositoryId: 'repo_cloud_telemetry',
      cronExpression: '0 4 * * *',
      timezone: 'America/New_York',
      frequency: 'DAILY',
      hour: 0,
      minute: 0,
      enabled: true,
      nextRunAt: new Date(now.getTime() + 3600000 * 6).toISOString(),
      lastRunAt: new Date(now.getTime() - 3600000 * 18).toISOString(),
      createdAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'sched_infra_manifests',
      repositoryId: 'repo_infra_manifests',
      cronExpression: '0 2 * * 1-5',
      timezone: 'UTC',
      frequency: 'WEEKDAYS',
      hour: 2,
      minute: 0,
      enabled: true,
      nextRunAt: new Date(now.getTime() + 3600000 * 8).toISOString(),
      lastRunAt: new Date(now.getTime() - 3600000 * 16).toISOString(),
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  const initialExecutions: Execution[] = [
    {
      id: 'exec_01',
      repositoryId: 'repo_portfolio',
      scheduleId: 'sched_portfolio',
      status: 'SUCCESS',
      startedAt: new Date(now.getTime() - 3600000 * 10).toISOString(),
      finishedAt: new Date(now.getTime() - 3600000 * 10 + 14800).toISOString(),
      durationSeconds: 14.8,
      commitSha: '8f31c2a',
      commitMessage: 'chore: update daily log',
      filesChanged: 2,
      retryCount: 0,
      logs: `Starting GitPulse Maintenance workflow...
[actions/checkout@v4] Checked out ref main at 8f31c2a
Running maintenance (DAILY_LOG)
Appended maintenance entry for 2026-09-26 to DAILY.md
[git status --porcelain] Detected 2 file changes: M DAILY.md, M .gitpulse/run.meta
[git commit] Created commit 8f31c2a: chore: update daily log
[git push] Successfully pushed changes to origin/main.
Result: SUCCESS (0 errors, 2 files updated).`,
      createdAt: new Date(now.getTime() - 3600000 * 10).toISOString(),
    },
    {
      id: 'exec_02',
      repositoryId: 'repo_dsa_visualizer',
      scheduleId: 'sched_dsa_visualizer',
      status: 'SUCCESS',
      startedAt: new Date(now.getTime() - 3600000 * 9.5).toISOString(),
      finishedAt: new Date(now.getTime() - 3600000 * 9.5 + 11200).toISOString(),
      durationSeconds: 11.2,
      commitSha: 'a91de72',
      commitMessage: 'docs: refresh documentation',
      filesChanged: 1,
      retryCount: 0,
      logs: `Starting GitPulse Maintenance workflow...
Running maintenance (CHANGELOG)
Inserted new section [2026-09-26] - Maintenance
[git status --porcelain] Detected changes in CHANGELOG.md
[git commit] Created commit a91de72
[git push] Pushed to origin/main.
Result: SUCCESS`,
      createdAt: new Date(now.getTime() - 3600000 * 9.5).toISOString(),
    },
    {
      id: 'exec_03',
      repositoryId: 'repo_cloud_telemetry',
      scheduleId: 'sched_cloud_telemetry',
      status: 'SKIPPED',
      startedAt: new Date(now.getTime() - 3600000 * 18).toISOString(),
      finishedAt: new Date(now.getTime() - 3600000 * 18 + 5200).toISOString(),
      durationSeconds: 5.2,
      commitSha: null,
      commitMessage: null,
      filesChanged: 0,
      errorCode: 'NO_CHANGES_DETECTED',
      errorMessage: 'No repository changes detected. Commit skipped to avoid empty commits.',
      retryCount: 0,
      logs: `Starting GitPulse Maintenance workflow...
Daily log entry for current cycle already present.
[git status --porcelain] Working tree clean.
Enforcing No-Empty-Commit Rule: git commit --allow-empty forbidden.
Recorded status: SKIPPED.`,
      createdAt: new Date(now.getTime() - 3600000 * 18).toISOString(),
    },
    {
      id: 'exec_04',
      repositoryId: 'repo_infra_manifests',
      scheduleId: 'sched_infra_manifests',
      status: 'SUCCESS',
      startedAt: new Date(now.getTime() - 3600000 * 16).toISOString(),
      finishedAt: new Date(now.getTime() - 3600000 * 16 + 22100).toISOString(),
      durationSeconds: 22.1,
      commitSha: '4c8e901',
      commitMessage: 'ci: execute scheduled repo sanity check',
      filesChanged: 3,
      retryCount: 0,
      logs: `Running custom maintenance script (.github/gitpulse/maintenance.sh)...
Executing manifest validation... OK
Refreshing Helm lock hashes... OK
Commit 4c8e901 pushed successfully.`,
      createdAt: new Date(now.getTime() - 3600000 * 16).toISOString(),
    },
    {
      id: 'exec_05',
      repositoryId: 'repo_experiments',
      scheduleId: 'sched_experiments',
      status: 'SUCCESS',
      startedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      finishedAt: new Date(now.getTime() - 86400000 * 4 + 8400).toISOString(),
      durationSeconds: 8.4,
      commitSha: '6b2d194',
      commitMessage: 'chore: update repository stats',
      filesChanged: 1,
      retryCount: 0,
      logs: `Generated .github/gitpulse/stats.json with 124 files, 21 directories.
Pushed commit 6b2d194.`,
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    },
  ];

  return {
    users: [initialUser],
    githubAccounts: [initialAccount],
    repositories: initialRepos,
    schedules: initialSchedules,
    executions: initialExecutions,
  };
}

class DatabaseStore {
  private data: DBData | null = null;

  private load(): DBData {
    if (this.data) return this.data;
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        return this.data!;
      } catch (err) {
        console.error('Failed to parse DB_FILE, seeding fresh initial data:', err);
      }
    }
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  private save(): void {
    if (!this.data) return;
    ensureDataDir();
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // Users
  getUserById(id: string): User | undefined {
    const db = this.load();
    return db.users.find((u) => u.id === id);
  }

  getUserByGithubId(githubUserId: string): User | undefined {
    const db = this.load();
    return db.users.find((u) => u.githubUserId === String(githubUserId));
  }

  upsertUser(user: Omit<User, 'createdAt' | 'updatedAt'>): User {
    const db = this.load();
    const existingIndex = db.users.findIndex((u) => u.githubUserId === String(user.githubUserId));
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      db.users[existingIndex] = {
        ...db.users[existingIndex],
        ...user,
        updatedAt: now,
      };
      this.save();
      return db.users[existingIndex];
    } else {
      const newUser: User = {
        ...user,
        createdAt: now,
        updatedAt: now,
      };
      db.users.push(newUser);
      this.save();
      return newUser;
    }
  }

  // GitHub Account
  getGitHubAccountByUserId(userId: string): GitHubAccount | undefined {
    const db = this.load();
    return db.githubAccounts.find((a) => a.userId === userId);
  }

  upsertGitHubAccount(account: Omit<GitHubAccount, 'createdAt' | 'updatedAt'>): GitHubAccount {
    const db = this.load();
    const existingIndex = db.githubAccounts.findIndex((a) => a.githubUserId === String(account.githubUserId));
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      db.githubAccounts[existingIndex] = {
        ...db.githubAccounts[existingIndex],
        ...account,
        updatedAt: now,
      };
      this.save();
      return db.githubAccounts[existingIndex];
    } else {
      const newAccount: GitHubAccount = {
        ...account,
        createdAt: now,
        updatedAt: now,
      };
      db.githubAccounts.push(newAccount);
      this.save();
      return newAccount;
    }
  }

  deleteGitHubAccount(id: string): boolean {
    const db = this.load();
    const target = db.githubAccounts.find((a) => a.id === id);
    if (!target) return false;

    // Cascade delete repos, schedules, executions
    const repoIds = db.repositories.filter((r) => r.githubAccountId === id).map((r) => r.id);
    db.executions = db.executions.filter((e) => !repoIds.includes(e.repositoryId));
    db.schedules = db.schedules.filter((s) => !repoIds.includes(s.repositoryId));
    db.repositories = db.repositories.filter((r) => r.githubAccountId !== id);
    db.githubAccounts = db.githubAccounts.filter((a) => a.id !== id);

    this.save();
    return true;
  }

  // Repositories
  getAllRepositories(): Repository[] {
    const db = this.load();
    return [...db.repositories];
  }

  getRepositoryById(id: string): Repository | undefined {
    const db = this.load();
    return db.repositories.find((r) => r.id === id);
  }

  getRepositoryByGithubRepoId(githubRepoId: number): Repository | undefined {
    const db = this.load();
    return db.repositories.find((r) => r.githubRepoId === githubRepoId);
  }

  createRepository(repo: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>): Repository {
    const db = this.load();
    const now = new Date().toISOString();
    const newRepo: Repository = {
      ...repo,
      id: `repo_${crypto.randomBytes(6).toString('hex')}`,
      createdAt: now,
      updatedAt: now,
    };
    db.repositories.push(newRepo);
    this.save();
    return newRepo;
  }

  updateRepository(id: string, updates: Partial<Repository>): Repository | null {
    const db = this.load();
    const index = db.repositories.findIndex((r) => r.id === id);
    if (index === -1) return null;

    db.repositories[index] = {
      ...db.repositories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return db.repositories[index];
  }

  deleteRepository(id: string): boolean {
    const db = this.load();
    const exists = db.repositories.some((r) => r.id === id);
    if (!exists) return false;

    db.executions = db.executions.filter((e) => e.repositoryId !== id);
    db.schedules = db.schedules.filter((s) => s.repositoryId !== id);
    db.repositories = db.repositories.filter((r) => r.id !== id);

    this.save();
    return true;
  }

  // Schedules
  getScheduleByRepositoryId(repositoryId: string): Schedule | undefined {
    const db = this.load();
    return db.schedules.find((s) => s.repositoryId === repositoryId);
  }

  getAllSchedules(): Schedule[] {
    const db = this.load();
    return [...db.schedules];
  }

  upsertSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Schedule {
    const db = this.load();
    const existingIndex = db.schedules.findIndex((s) => s.repositoryId === schedule.repositoryId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      db.schedules[existingIndex] = {
        ...db.schedules[existingIndex],
        ...schedule,
        updatedAt: now,
      };
      this.save();
      return db.schedules[existingIndex];
    } else {
      const newSchedule: Schedule = {
        ...schedule,
        id: `sched_${crypto.randomBytes(6).toString('hex')}`,
        createdAt: now,
        updatedAt: now,
      };
      db.schedules.push(newSchedule);
      this.save();
      return newSchedule;
    }
  }

  updateSchedule(id: string, updates: Partial<Schedule>): Schedule | null {
    const db = this.load();
    const index = db.schedules.findIndex((s) => s.id === id);
    if (index === -1) return null;

    db.schedules[index] = {
      ...db.schedules[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return db.schedules[index];
  }

  // Executions
  getAllExecutions(limit = 100, repositoryId?: string): Execution[] {
    const db = this.load();
    let list = [...db.executions];
    if (repositoryId) {
      list = list.filter((e) => e.repositoryId === repositoryId);
    }
    list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return list.slice(0, limit);
  }

  getExecutionById(id: string): Execution | undefined {
    const db = this.load();
    return db.executions.find((e) => e.id === id);
  }

  createExecution(exec: Omit<Execution, 'id' | 'createdAt'>): Execution {
    const db = this.load();
    const now = new Date().toISOString();
    const newExec: Execution = {
      ...exec,
      id: `exec_${crypto.randomBytes(6).toString('hex')}`,
      createdAt: now,
    };
    db.executions.unshift(newExec);
    this.save();
    return newExec;
  }

  updateExecution(id: string, updates: Partial<Execution>): Execution | null {
    const db = this.load();
    const index = db.executions.findIndex((e) => e.id === id);
    if (index === -1) return null;

    db.executions[index] = {
      ...db.executions[index],
      ...updates,
    };
    this.save();
    return db.executions[index];
  }

  // Idempotency: check if repository successfully ran on a specific calendar day in UTC
  hasExecutedForPeriod(repositoryId: string, periodDateStr: string): boolean {
    const db = this.load();
    return db.executions.some(
      (e) =>
        e.repositoryId === repositoryId &&
        e.status === 'SUCCESS' &&
        e.startedAt.slice(0, 10) === periodDateStr
    );
  }

  // Metrics for Dashboard
  getDashboardMetrics() {
    const db = this.load();
    const totalRepos = db.repositories.length;
    const activeAutomations = db.repositories.filter((r) => r.enabled).length;

    const oneWeekAgo = Date.now() - 7 * 86400000;
    const recentExecs = db.executions.filter((e) => new Date(e.startedAt).getTime() >= oneWeekAgo);
    const runsThisWeek = recentExecs.length;

    const finishedExecs = db.executions.filter((e) => e.status === 'SUCCESS' || e.status === 'FAILED');
    const successfulExecs = db.executions.filter((e) => e.status === 'SUCCESS');
    const successRate =
      finishedExecs.length > 0
        ? Math.round((successfulExecs.length / finishedExecs.length) * 1000) / 10
        : 100;

    return {
      totalRepositories: totalRepos,
      activeAutomations,
      runsThisWeek,
      successRate,
    };
  }
}

export const db = new DatabaseStore();
