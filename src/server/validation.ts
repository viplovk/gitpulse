import { z } from 'zod';

export const CreateRepositorySchema = z.object({
  githubRepoId: z.number().int().positive(),
  owner: z.string().min(1),
  name: z.string().min(1),
  fullName: z.string().min(1),
  defaultBranch: z.string().default('main'),
  private: z.boolean().default(false),
  maintenanceStrategy: z.enum(['DAILY_LOG', 'CHANGELOG', 'STATS_JSON', 'CUSTOM_SCRIPT']).default('DAILY_LOG'),
  branch: z.string().default('main'),
  commitMessageStyle: z.string().min(3).max(200).default('chore: automated repository maintenance'),
  executionMode: z.enum(['DIRECT_COMMIT', 'PULL_REQUEST']).default('DIRECT_COMMIT'),
  schedule: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'WEEKDAYS', 'CUSTOM']).default('DAILY'),
    hour: z.number().min(0).max(23).default(21),
    minute: z.number().min(0).max(59).default(0),
    dayOfWeek: z.number().min(0).max(6).optional(),
    timezone: z.string().default('Asia/Kolkata'),
    customCron: z.string().optional(),
  }).optional(),
});

export const UpdateRepositorySchema = z.object({
  maintenanceStrategy: z.enum(['DAILY_LOG', 'CHANGELOG', 'STATS_JSON', 'CUSTOM_SCRIPT']).optional(),
  branch: z.string().min(1).optional(),
  commitMessageStyle: z.string().min(3).max(200).optional(),
  executionMode: z.enum(['DIRECT_COMMIT', 'PULL_REQUEST']).optional(),
  enabled: z.boolean().optional(),
});

export const UpdateScheduleSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'WEEKDAYS', 'CUSTOM']),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  dayOfWeek: z.number().min(0).max(6).optional(),
  timezone: z.string().min(1),
  customCron: z.string().optional(),
  enabled: z.boolean().optional(),
});

export const PatAuthSchema = z.object({
  token: z.string().min(10, 'Personal Access Token is required'),
});
