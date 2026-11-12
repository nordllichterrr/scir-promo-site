export type LabUser = {
  id: number;
  username: string;
  email: string;
};

export type LabDataset = {
  id: number;
  slug: string;
  name: string;
  description: string;
  version: string;
  source: string;
  folds_count: number;
};

export type LabExperiment = {
  id: string;
  owner_id: number;
  name: string;
  description: string;
  draft_config: Record<string, unknown>;
  is_archived: boolean;
  runs_count: number;
  created_at: string;
  updated_at: string;
};

export type LabRun = {
  id: string;
  experiment: string;
  dataset_fold: number;
  dataset_name: string;
  dataset_slug: string;
  fold_index: number;
  status: string;
  progress: number;
  stage: string;
  config_snapshot: Record<string, unknown>;
  seed: number;
  split_seed: number;
  init_seed: number;
  n_users: number | null;
  topk: number;
  created_at: string;
  updated_at: string;
};

export class LabApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'LabApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = await getCsrfToken();
    headers.set('X-CSRFToken', token);
  }

  const execute = () =>
    fetch(`/api/lab/${path}`, {
      ...options,
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers,
    });

  const response = await execute();

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new LabApiError(
      data.detail || data.error || `Request failed (${response.status})`,
      response.status,
    );
  }

  return data as T;
}

let csrfToken: string | null = null;

export async function getCsrfToken(force = false): Promise<string> {
  if (csrfToken && !force) return csrfToken;

  const result = await request<{ csrfToken: string }>('auth/csrf/');
  csrfToken = result.csrfToken;

  return csrfToken;
}

async function csrfRequest<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const result = await request<T>(path, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  csrfToken = null;
  return result;
}

export const labApi = {
  me: () =>
    request<{ authenticated: boolean; user: LabUser }>('auth/me/'),

  register: (data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
  }) =>
    csrfRequest<{ user: LabUser; detail: string }>(
      'auth/register/',
      'POST',
      data,
    ),

  login: (data: { username: string; password: string }) =>
    csrfRequest<{ user: LabUser; detail: string }>(
      'auth/login/',
      'POST',
      data,
    ),

  logout: () =>
    csrfRequest<{ detail: string }>('auth/logout/', 'POST', {}),

  datasets: () =>
    request<LabDataset[]>('datasets/'),

  datasetFolds: (id: number) =>
    request<Array<{
      id: number;
      split_type: string;
      fold_index: number;
      split_seed: number;
      test_users_count: number | null;
      test_targets_count: number | null;
    }>>(`datasets/${id}/folds/`),

  experiments: () =>
    request<LabExperiment[]>('experiments/'),

  createExperiment: (data: {
    name: string;
    description: string;
    draft_config: Record<string, unknown>;
  }) =>
    request<LabExperiment>('experiments/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  experiment: (id: string) =>
    request<LabExperiment>(`experiments/${id}/`),

  updateExperiment: (
    id: string,
    data: Partial<Pick<LabExperiment, 'name' | 'description' | 'draft_config' | 'is_archived'>>,
  ) =>
    request<LabExperiment>(`experiments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteExperiment: (id: string) =>
    request<void>(`experiments/${id}/`, { method: 'DELETE' }),

  runs: (experimentId: string) =>
    request<LabRun[]>(`experiments/${experimentId}/runs/`),

  createRun: (
    experimentId: string,
    data: {
      dataset_fold: number;
      config_snapshot: Record<string, unknown>;
      seed: number;
      split_seed: number;
      init_seed: number;
      n_users?: number | null;
      topk: number;
    },
  ) =>
    request<{ detail: string; run: LabRun }>(
      `experiments/${experimentId}/runs/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  run: (id: string) =>
    request<LabRun>(`runs/${id}/`),

  metrics: (id: string) =>
    request<Array<{
      id: number;
      name: string;
      stage: string;
      dimension: string;
      dimension_key: string;
      value: number | null;
      std: number | null;
      ci95_low: number | null;
      ci95_high: number | null;
      sample_count: number | null;
    }>>(`runs/${id}/metrics/`),

  artifacts: (id: string) =>
    request<Array<{
      id: number;
      name: string;
      kind: string;
      mime_type: string;
      size_bytes: number;
      sha256: string;
    }>>(`runs/${id}/artifacts/`),

  logs: (id: string) =>
    request<Array<{
      id: number;
      sequence: number;
      level: string;
      stage: string;
      message: string;
      created_at: string;
    }>>(`runs/${id}/logs/`),
};
