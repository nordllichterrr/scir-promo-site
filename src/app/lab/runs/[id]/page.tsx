'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LabRun, labApi } from '@/lib/lab/api';
import { RequireLabAuth } from '@/components/lab/LabAuth';
import LabShell from '@/components/lab/LabShell';

type Metric = {
  id: number;
  name: string;
  stage: string;
  dimension: string;
  dimension_key: string;
  value: number | null;
  sample_count: number | null;
};

type Artifact = {
  id: number;
  name: string;
  kind: string;
  mime_type: string;
  sha256: string;
};

type LogEntry = {
  id: number;
  sequence: number;
  level: string;
  stage: string;
  message: string;
  created_at: string;
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

function RunContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [run, setRun] = useState<LabRun | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRun = useCallback(async () => {
    const runData = await labApi.run(id);
    setRun(runData);

    const results = await Promise.allSettled([
      labApi.metrics(id),
      labApi.artifacts(id),
      labApi.logs(id),
    ]);

    const failures: string[] = [];

    if (results[0].status === 'fulfilled') {
      setMetrics(results[0].value);
    } else {
      failures.push('метрики');
    }

    if (results[1].status === 'fulfilled') {
      setArtifacts(results[1].value);
    } else {
      failures.push('артефакты');
    }

    if (results[2].status === 'fulfilled') {
      setLogs(results[2].value);
    } else {
      failures.push('логи');
    }

    setError(
      failures.length
        ? `Не удалось обновить разделы: ${failures.join(', ')}. Остальные данные загружены.`
        : '',
    );
  }, [id]);

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      try {
        await loadRun();
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить запуск.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialLoad();

    return () => {
      active = false;
    };
  }, [loadRun]);

  const isActive = run
    ? ['pending', 'queued', 'running'].includes(run.status)
    : false;

  useEffect(() => {
    if (!isActive) return;

    const timer = window.setInterval(() => {
      void loadRun().catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка обновления данных.');
      });
    }, 3000);

    return () => window.clearInterval(timer);
  }, [isActive, loadRun]);

  if (loading) {
    return (
      <LabShell>
        <p className="text-[#94a3c4]">Загрузка данных запуска...</p>
      </LabShell>
    );
  }

  if (!run) {
    return (
      <LabShell>
        <p className="text-[#ff9ab7]">{error || 'Запуск не найден.'}</p>
        <Link href="/lab/dashboard" className="inline-block mt-4 text-[#00d1b2]">
          Вернуться в лабораторию →
        </Link>
      </LabShell>
    );
  }

  const statusColor =
    run.status === 'succeeded'
      ? 'text-[#00d1b2]'
      : ['failed', 'cancelled'].includes(run.status)
        ? 'text-[#ff5b8c]'
        : 'text-[#f0a6ca]';

  return (
    <LabShell>
      <Link
        href={`/lab/experiments/${run.experiment}`}
        className="text-sm text-[#94a3c4] hover:text-[#00d1b2]"
      >
        ← К эксперименту
      </Link>

      <div className="mt-6 mb-8">
        <p className="text-sm tracking-[0.2em] text-[#00d1b2] font-bold">
          EXPERIMENT RUN
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <h1 className="text-4xl font-black">Мониторинг запуска</h1>
          <span className={`text-lg font-bold ${statusColor}`}>
            {statusLabel(run.status)}
          </span>
        </div>
        <p className="text-xs text-[#64748b] mt-3 break-all">{run.id}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#ff5b8c]/40 bg-[#ff5b8c]/10 p-4 text-sm text-[#ff9ab7]">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6 mb-8">
        <div className="flex justify-between items-center gap-4 mb-3">
          <h2 className="font-bold text-lg">Прогресс выполнения</h2>
          <span className="text-[#00d1b2] font-bold tabular-nums">
            {run.progress || 0}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-[#26325a] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00d1b2] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, run.progress || 0))}%` }}
          />
        </div>

        <div className="flex flex-wrap justify-between gap-3 mt-4 text-sm">
          <span className="text-[#94a3c4]">
            Этап: {run.stage || 'Ожидание'}
          </span>
          <span className="text-[#64748b]">
            Обновление каждые 3 секунды при активном запуске
          </span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          { label: 'Датасет', value: run.dataset_name || run.dataset_slug || '—' },
          { label: 'Fold', value: String(run.fold_index ?? '—') },
          { label: 'Top-K', value: String(run.topk) },
          { label: 'Пользователи', value: run.n_users == null ? 'Все' : String(run.n_users) },
          { label: 'Seed', value: String(run.seed) },
          { label: 'Split seed', value: String(run.split_seed) },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[#26325a] bg-[#0d1529] p-5"
          >
            <p className="text-xs text-[#94a3c4]">{item.label}</p>
            <p className="font-bold mt-2 break-words">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">Метрики качества</h2>

        {metrics.length === 0 ? (
          <p className="text-sm text-[#94a3c4]">
            Метрики появятся после того, как Worker выполнит вычисления и сохранит результаты.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[#94a3c4] border-b border-[#26325a]">
                <tr>
                  <th className="py-3 pr-4">Метрика</th>
                  <th className="py-3 pr-4">Этап</th>
                  <th className="py-3 pr-4">Измерение</th>
                  <th className="py-3 pr-4">Значение</th>
                  <th className="py-3">N</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-b border-[#26325a]/70">
                    <td className="py-3 pr-4 font-semibold">{metric.name}</td>
                    <td className="py-3 pr-4 text-[#94a3c4]">{metric.stage}</td>
                    <td className="py-3 pr-4 text-[#94a3c4]">
                      {metric.dimension}
                      {metric.dimension_key ? ` · ${metric.dimension_key}` : ''}
                    </td>
                    <td className="py-3 pr-4 text-[#00d1b2] font-mono">
                      {metric.value == null ? '—' : metric.value.toFixed(5)}
                    </td>
                    <td className="py-3 text-[#94a3c4]">
                      {metric.sample_count ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">Артефакты</h2>

        {artifacts.length === 0 ? (
          <p className="text-sm text-[#94a3c4]">
            Артефакты появятся после выполнения эксперимента.
          </p>
        ) : (
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="rounded-lg border border-[#26325a] p-4"
              >
                <p className="font-semibold">{artifact.name}</p>
                <p className="text-xs text-[#94a3c4] mt-1">
                  {artifact.kind} · {artifact.mime_type || 'unknown type'}
                </p>
                <p className="text-xs text-[#64748b] mt-2 break-all">
                  SHA-256: {artifact.sha256 || 'не указан'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6">
        <h2 className="text-xl font-bold mb-5">Журнал событий</h2>

        {logs.length === 0 ? (
          <p className="text-sm text-[#94a3c4]">
            События появятся, когда Worker начнёт обработку запуска.
          </p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border-l-2 border-[#00d1b2]/50 pl-4 py-1"
              >
                <div className="flex flex-wrap gap-3 text-xs text-[#64748b]">
                  <span>#{log.sequence}</span>
                  <span>{log.level.toUpperCase()}</span>
                  <span>{log.stage}</span>
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-[#cbd5e1] mt-1">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </LabShell>
  );
}

export default function RunPage() {
  return (
    <RequireLabAuth>
      <RunContent />
    </RequireLabAuth>
  );
}
