'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LabApiError,
  LabDataset,
  LabExperiment,
  LabRun,
  labApi,
} from '@/lib/lab/api';
import { RequireLabAuth } from '@/components/lab/LabAuth';
import LabShell from '@/components/lab/LabShell';

type Fold = {
  id: number;
  fold_index: number;
  split_seed: number;
  split_type?: string;
};

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Ожидает запуска',
    queued: 'В очереди',
    running: 'Выполняется',
    succeeded: 'Завершён',
    failed: 'Ошибка',
    cancelled: 'Отменён',
  };

  return labels[status] || status;
}

function statusColor(status: string) {
  if (status === 'succeeded') return 'text-[#00d1b2]';
  if (status === 'failed' || status === 'cancelled') return 'text-[#ff5b8c]';
  if (status === 'running' || status === 'queued') return 'text-[#f0a6ca]';
  return 'text-[#94a3c4]';
}

function ExperimentContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [experiment, setExperiment] = useState<LabExperiment | null>(null);
  const [runs, setRuns] = useState<LabRun[]>([]);
  const [datasets, setDatasets] = useState<LabDataset[]>([]);
  const [folds, setFolds] = useState<Fold[]>([]);
  const [foldsDatasetId, setFoldsDatasetId] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [foldId, setFoldId] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    const [experimentData, runData] = await Promise.all([
      labApi.experiment(id),
      labApi.runs(id),
    ]);

    setExperiment(experimentData);
    setRuns(runData);
  }, [id]);

  useEffect(() => {
    let active = true;

    Promise.all([labApi.experiment(id), labApi.runs(id), labApi.datasets()])
      .then(([experimentData, runData, datasetData]) => {
        if (!active) return;
        setExperiment(experimentData);
        setRuns(runData);
        setDatasets(datasetData);

        const savedDatasetId = Number(experimentData.draft_config?.dataset_id);
        const initialDataset = datasetData.find(
          (dataset) => dataset.id === savedDatasetId,
        ) ?? datasetData[0];

        if (initialDataset) setDatasetId(String(initialDataset.id));
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить эксперимент.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const draftDatasetIdForFold = Number(experiment?.draft_config?.dataset_id);
  const draftFoldId = Number(experiment?.draft_config?.dataset_fold);

  useEffect(() => {
    if (!datasetId) return;

    let active = true;

    labApi.datasetFolds(Number(datasetId))
      .then((data) => {
        if (!active) return;
        setFolds(data);
        setFoldsDatasetId(datasetId);

        const isSavedDataset = Number(datasetId) === draftDatasetIdForFold;
        const preferredFold = isSavedDataset
          ? data.find((fold) => fold.id === draftFoldId)
          : undefined;

        setFoldId(
          preferredFold
            ? String(preferredFold.id)
            : data.length
              ? String(data[0].id)
              : '',
        );
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Ошибка загрузки folds.');
      });

    return () => {
      active = false;
    };
  }, [datasetId, draftDatasetIdForFold, draftFoldId]);

  const currentFolds = foldsDatasetId === datasetId ? folds : [];

  const hasActiveRuns = runs.some((run) =>
    ['pending', 'queued', 'running'].includes(run.status),
  );

  useEffect(() => {
    if (!hasActiveRuns) return;

    const timer = window.setInterval(() => {
      void loadData().catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [hasActiveRuns, loadData]);

  async function persistDraft(): Promise<LabExperiment | null> {
    setError('');

    if (!datasetId || !foldId) {
      setError('Выберите датасет и доступный fold перед сохранением.');
      return null;
    }

    const selectedFold = currentFolds.find(
      (fold) => fold.id === Number(foldId),
    );

    if (!selectedFold) {
      setError('Выбранный fold больше недоступен. Обновите страницу.');
      return null;
    }

    setSaving(true);

    try {
      const draft = experiment?.draft_config ?? {};

      const updated = await labApi.updateExperiment(id, {
        draft_config: {
          ...draft,
          dataset_id: Number(datasetId),
          dataset_fold: Number(foldId),
          split_type: selectedFold.split_type ?? draft.split_type ?? 'standard',
        },
      });

      setExperiment(updated);
      return updated;
    } catch (err) {
      setError(
        err instanceof LabApiError
          ? err.message
          : 'Не удалось сохранить конфигурацию.',
      );
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function createRun() {
    setError('');

    if (!foldId) {
      setError('Для выбранного датасета нет доступных folds.');
      return;
    }

    setCreating(true);

    try {
      const updatedExperiment = await persistDraft();

      if (!updatedExperiment) return;

      const selectedFold = currentFolds.find(
        (fold) => fold.id === Number(foldId),
      );
      const draft = updatedExperiment.draft_config ?? {};

      const savedConfig = draft.config;
      const configSnapshot =
        savedConfig &&
        typeof savedConfig === 'object' &&
        !Array.isArray(savedConfig)
          ? savedConfig as Record<string, unknown>
          : {
              algorithm: 'SCIR',
              evaluation: 'multi_objective',
            };

      const result = await labApi.createRun(id, {
        dataset_fold: Number(foldId),
        config_snapshot: configSnapshot,
        seed: Number(draft.seed ?? 42),
        split_seed: selectedFold?.split_seed ?? Number(draft.split_seed ?? 42),
        init_seed: Number(draft.init_seed ?? draft.seed ?? 42),
        n_users: draft.n_users == null ? null : Number(draft.n_users),
        topk: Number(draft.topk ?? 10),
      });

      router.push(`/lab/runs/${result.run.id}`);
    } catch (err) {
      setError(
        err instanceof LabApiError
          ? err.message
          : 'Не удалось создать запуск.',
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <LabShell>
        <p className="text-[#94a3c4]">Загрузка эксперимента...</p>
      </LabShell>
    );
  }

  if (!experiment) {
    return (
      <LabShell>
        <p className="text-[#ff9ab7]">
          {error || 'Эксперимент не найден или у вас нет доступа.'}
        </p>
        <Link href="/lab/dashboard" className="text-[#00d1b2] mt-4 inline-block">
          Вернуться к экспериментам →
        </Link>
      </LabShell>
    );
  }

  return (
    <LabShell>
      <Link
        href="/lab/dashboard"
        className="text-sm text-[#94a3c4] hover:text-[#00d1b2]"
      >
        ← Все эксперименты
      </Link>

      <div className="flex flex-wrap justify-between items-start gap-5 mt-6 mb-8">
        <div>
          <p className="text-sm tracking-[0.2em] text-[#00d1b2] font-bold">
            EXPERIMENT
          </p>
          <h1 className="text-4xl font-black mt-2">{experiment.name}</h1>
          <p className="text-[#94a3c4] mt-3 max-w-2xl">
            {experiment.description || 'Описание эксперимента не добавлено.'}
          </p>
        </div>
        <button
          onClick={() => setShowBuilder((value) => !value)}
          className="rounded-xl bg-[#00d1b2] px-6 py-3 font-bold text-[#070b16] hover:bg-[#43e8ce]"
        >
          + Новый запуск
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-[#26325a] bg-[#0d1529] p-5">
          <p className="text-sm text-[#94a3c4]">Всего запусков</p>
          <p className="text-3xl font-black mt-2">{runs.length}</p>
        </div>
        <div className="rounded-xl border border-[#26325a] bg-[#0d1529] p-5">
          <p className="text-sm text-[#94a3c4]">Успешные</p>
          <p className="text-3xl font-black mt-2 text-[#00d1b2]">
            {runs.filter((run) => run.status === 'succeeded').length}
          </p>
        </div>
        <div className="rounded-xl border border-[#26325a] bg-[#0d1529] p-5">
          <p className="text-sm text-[#94a3c4]">Активные</p>
          <p className="text-3xl font-black mt-2 text-[#f0a6ca]">
            {runs.filter((run) => ['pending', 'queued', 'running'].includes(run.status)).length}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#ff5b8c]/40 bg-[#ff5b8c]/10 p-4 text-sm text-[#ff9ab7]">
          {error}
        </div>
      )}

      {showBuilder && (
        <section className="rounded-2xl border border-[#00d1b2]/40 bg-[#0d1529] p-6 mb-8">
          <h2 className="font-bold text-xl mb-5">Новый запуск</h2>

          {datasets.length === 0 ? (
            <p className="text-sm text-[#94a3c4]">
              Нет доступных датасетов. Сначала зарегистрируйте их в Django Admin.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">Датасет</span>
                <select
                  value={datasetId}
                  onChange={(event) => {
                    setDatasetId(event.target.value);
                    setFoldId('');
                    setFolds([]);
                    setFoldsDatasetId('');
                  }}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3"
                >
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">Fold</span>
                <select
                  value={foldId}
                  onChange={(event) => setFoldId(event.target.value)}
                  disabled={!currentFolds.length}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 disabled:opacity-50"
                >
                  {currentFolds.map((fold) => (
                    <option key={fold.id} value={fold.id}>
                      Fold {fold.fold_index} · seed {fold.split_seed}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 mt-6">
            <button
              onClick={() => setShowBuilder(false)}
              disabled={saving || creating}
              className="rounded-lg border border-[#334269] px-5 py-3 text-[#94a3c4] disabled:opacity-40"
            >
              Отмена
            </button>
            <button
              onClick={() => void persistDraft()}
              disabled={saving || creating || !foldId}
              className="rounded-lg border border-[#00d1b2] px-5 py-3 font-semibold text-[#00d1b2] disabled:opacity-40"
            >
              {saving ? 'Сохранение...' : 'Сохранить конфигурацию'}
            </button>
            <button
              onClick={createRun}
              disabled={creating || saving || !foldId}
              className="rounded-lg bg-[#00d1b2] px-6 py-3 font-bold text-[#070b16] disabled:opacity-40"
            >
              {creating ? 'Создание...' : 'Создать запуск'}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6">
        <h2 className="text-xl font-bold mb-5">История запусков</h2>

        {runs.length === 0 ? (
          <div className="text-center py-12 text-[#94a3c4]">
            <p>Запусков пока нет.</p>
            <p className="text-sm mt-2">
              Создайте первый запуск, чтобы начать исследование.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => (
              <Link
                key={run.id}
                href={`/lab/runs/${run.id}`}
                className="block rounded-xl border border-[#26325a] p-5 hover:border-[#00d1b2] transition"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {run.dataset_name || run.dataset_slug || 'Dataset'} · Fold {run.fold_index}
                    </p>
                    <p className="text-xs text-[#64748b] mt-2">
                      {run.id}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${statusColor(run.status)}`}>
                    {statusLabel(run.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-[#26325a] overflow-hidden">
                    <div
                      className="h-full bg-[#00d1b2] transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, run.progress || 0))}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#94a3c4] tabular-nums">
                    {run.progress || 0}%
                  </span>
                </div>

                <p className="text-xs text-[#64748b] mt-3">
                  Создан: {new Date(run.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </LabShell>
  );
}

export default function ExperimentPage() {
  return (
    <RequireLabAuth>
      <ExperimentContent />
    </RequireLabAuth>
  );
}
