import {
  User,
  GitHubAccountInfo,
  Repository,
  Schedule,
  Execution,
  DashboardMetrics,
  GithubRepoItem,
} from '../types.ts';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch {
      // not JSON
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async getAuthStatus(): Promise<{ connected: boolean; user?: User; githubAccount?: GitHubAccountInfo | null }> {
    const res = await fetch('/api/auth/me');
    return handleResponse(res);
  },

  async getOAuthUrl(): Promise<{ configured: boolean; url?: string; redirectUri: string; message?: string }> {
    const res = await fetch('/api/auth/github/url');
    return handleResponse(res);
  },

  async connectWithPat(token: string): Promise<{ connected: boolean; username: string }> {
    const res = await fetch('/api/auth/pat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(res);
  },

  async disconnectGitHub(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/disconnect', { method: 'POST' });
    return handleResponse(res);
  },

  // GitHub Repos Discovery
  async getGithubAvailableRepos(): Promise<GithubRepoItem[]> {
    const res = await fetch('/api/github/repos');
    return handleResponse(res);
  },

  // Repositories
  async getRepositories(): Promise<Repository[]> {
    const res = await fetch('/api/repositories');
    return handleResponse(res);
  },

  async getRepository(id: string): Promise<Repository & { executions: Execution[] }> {
    const res = await fetch(`/api/repositories/${id}`);
    return handleResponse(res);
  },

  async addRepository(data: {
    githubRepoId: number;
    owner: string;
    name: string;
    fullName: string;
    defaultBranch: string;
    private: boolean;
    maintenanceStrategy: string;
    branch: string;
    commitMessageStyle: string;
    executionMode: string;
    schedule?: any;
  }): Promise<{ repository: Repository; schedule: Schedule }> {
    const res = await fetch('/api/repositories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateRepository(id: string, updates: Partial<Repository>): Promise<Repository> {
    const res = await fetch(`/api/repositories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async deleteRepository(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/repositories/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async enableAutomation(id: string): Promise<{
    success: boolean;
    enabled: boolean;
    workflowPushed: boolean;
    workflowContent: string;
    message: string;
  }> {
    const res = await fetch(`/api/repositories/${id}/enable`, { method: 'POST' });
    return handleResponse(res);
  },

  async disableAutomation(id: string): Promise<{ success: boolean; enabled: boolean; message: string }> {
    const res = await fetch(`/api/repositories/${id}/disable`, { method: 'POST' });
    return handleResponse(res);
  },

  // Schedules
  async getSchedules(): Promise<Schedule[]> {
    const res = await fetch('/api/schedules');
    return handleResponse(res);
  },

  async updateSchedule(
    repositoryId: string,
    schedule: {
      frequency: string;
      hour: number;
      minute: number;
      dayOfWeek?: number;
      timezone: string;
      customCron?: string;
      enabled?: boolean;
    }
  ): Promise<Schedule> {
    const res = await fetch(`/api/repositories/${repositoryId}/schedule`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    return handleResponse(res);
  },

  // Test Run
  async triggerTestRun(repositoryId: string): Promise<Execution> {
    const res = await fetch(`/api/repositories/${repositoryId}/test`, { method: 'POST' });
    return handleResponse(res);
  },

  // Executions
  async getExecutions(limit = 100, repositoryId?: string): Promise<Execution[]> {
    const url = new URL('/api/executions', window.location.origin);
    url.searchParams.set('limit', String(limit));
    if (repositoryId) url.searchParams.set('repositoryId', repositoryId);
    const res = await fetch(url.toString());
    return handleResponse(res);
  },

  async getExecution(id: string): Promise<Execution> {
    const res = await fetch(`/api/executions/${id}`);
    return handleResponse(res);
  },

  // Dashboard Stats
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await fetch('/api/dashboard/stats');
    return handleResponse(res);
  },
};
