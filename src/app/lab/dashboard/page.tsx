'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LabApiError, LabDataset, LabExperiment, labApi } from '@/lib/lab/api';
import { RequireLabAuth } from '@/components/lab/LabAuth';
import LabShell from '@/components/lab/LabShell';

function DashboardContent() {
  const [datasets, setDatasets] = useState<LabDataset[]>([]);
  const [experiments, setExperiments] = useState<LabExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([labApi.datasets(), labApi.experiments()])
      .then(([datasetData, experimentData]) => {
        if (!active) return;
        setDatasets(datasetData);
        setExperiments(experimentData);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof LabApiError
            ? err.message
            : 'Не удалось загрузить данные лаборатории.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <LabShell>
      <div className="flex flex-wrap items-start justify-between gap-5 mb-10">
        <div>
          <p className="text-sm tracking-[0.2em] text-[#00d1b2] font-bold">
            RESEARCH WORKSPACE
          </p>
          <h1 className="text-4xl font-black mt-2">Обзор лаборатории</h1>
          <p className="text-[#94a3c4] mt-3">
            Управление экспериментами, датасетами и результатами исследований.
          </p>
        </div>
        <Link
          href="/lab/experiments/new"
          className="rounded-xl bg-[#00d1b2] px-6 py-3 font-bold text-[#070b16] hover:bg-[#43e8ce] transition"
        >
          + Новый эксперимент
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#ff5b8c]/40 bg-[#ff5b8c]/10 p-4 text-[#ff9ab7]">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3 mb-10">
        {[
          { label: 'Эксперименты', value: experiments.length },
          { label: 'Доступные датасеты', value: datasets.length },
          {
            label: 'Запуски',
            value: experiments.reduce((sum, item) => sum + (item.runs_count || 0), 0),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6"
          >
            <p className="text-sm text-[#94a3c4]">{item.label}</p>
            <p className="mt-3 text-4xl font-black text-[#00d1b2]">
              {loading ? '—' : item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-bold">Мои эксперименты</h2>
          <span className="text-xs text-[#64748b]">
            {experiments.length} всего
          </span>
        </div>

        {loading ? (
          <p className="text-[#94a3c4]">Загрузка экспериментов...</p>
        ) : experiments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#334269] p-8 text-center">
            <p className="text-[#94a3c4] mb-4">
              Пока нет экспериментов. Создайте первый исследовательский проект.
            </p>
            <Link
              href="/lab/experiments/new"
              className="text-[#00d1b2] hover:underline"
            >
              Создать эксперимент →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {experiments.map((experiment) => (
              <Link
                key={experiment.id}
                href={`/lab/experiments/${experiment.id}`}
                className="block rounded-xl border border-[#26325a] p-5 hover:border-[#00d1b2] transition"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{experiment.name}</h3>
                    <p className="text-sm text-[#94a3c4] mt-1">
                      {experiment.description || 'Описание не добавлено'}
                    </p>
                  </div>
                  <span className="text-sm text-[#00d1b2]">
                    {experiment.runs_count} запусков →
                  </span>
                </div>
                <p className="text-xs text-[#64748b] mt-4">
                  Обновлён: {new Date(experiment.updated_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6">
        <h2 className="text-xl font-bold mb-5">Dataset Registry</h2>
        {loading ? (
          <p className="text-[#94a3c4]">Загрузка датасетов...</p>
        ) : datasets.length === 0 ? (
          <p className="text-sm text-[#94a3c4]">
            Активные датасеты пока не зарегистрированы. Их добавление выполняется администратором лаборатории.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="rounded-xl border border-[#26325a] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">{dataset.name}</h3>
                  <span className="text-xs text-[#00d1b2]">
                    v{dataset.version}
                  </span>
                </div>
                <p className="text-sm text-[#94a3c4] mt-2">
                  {dataset.description || 'Описание отсутствует'}
                </p>
                <p className="text-xs text-[#64748b] mt-4">
                  {dataset.slug} · {dataset.folds_count ?? '—'} folds
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </LabShell>
  );
}

export default function DashboardPage() {
  return (
    <RequireLabAuth>
      <DashboardContent />
    </RequireLabAuth>
  );
}
