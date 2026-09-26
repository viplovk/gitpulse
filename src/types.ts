export interface User {
  id: string;
  githubUserId: string;
  username: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface GitHubAccountInfo {
  id: string;
  username: string;
  hasToken: boolean;
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
  schedule?: Schedule | null;
  lastExecution?: Execution | null;
  totalExecutions?: number;
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
  repository?: {
    id: string;
    fullName: string;
    name: string;
  };
  display?: {
    localText: string;
    utcText: string;
    cron: string;
  };
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
  repository?: {
    id: string;
    fullName: string;
    owner: string;
    name: string;
  } | null;
}

export interface DashboardMetrics {
  totalRepositories: number;
  activeAutomations: number;
  runsThisWeek: number;
  successRate: number;
}

export interface GithubRepoItem {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
}
