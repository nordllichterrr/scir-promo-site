'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LabDataset, LabApiError, labApi } from '@/lib/lab/api';
import { RequireLabAuth } from '@/components/lab/LabAuth';
import LabShell from '@/components/lab/LabShell';

type Fold = {
  id: number;
  split_type: string;
  fold_index: number;
  split_seed: number;
  test_users_count: number | null;
  test_targets_count: number | null;
};

function BuilderContent() {
  const router = useRouter();

  const [datasets, setDatasets] = useState<LabDataset[]>([]);
  const [folds, setFolds] = useState<Fold[]>([]);
  const [foldsDatasetId, setFoldsDatasetId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [foldId, setFoldId] = useState('');
  const [splitType, setSplitType] = useState('standard');
  const [nUsers, setNUsers] = useState('500');
  const [topk, setTopk] = useState('10');
  const [seed, setSeed] = useState('42');
  const [configText, setConfigText] = useState('{\n  "algorithm": "SCIR",\n  "evaluation": "multi_objective"\n}');
  const [loading, setLoading] = useState(false);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    labApi.datasets()
      .then((data) => {
        setDatasets(data);
        if (data.length) setDatasetId(String(data[0].id));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить датасеты.');
      })
      .finally(() => setLoadingDatasets(false));
  }, []);

  useEffect(() => {
    if (!datasetId) return;

    let active = true;

    labApi.datasetFolds(Number(datasetId))
      .then((data) => {
        if (!active) return;
        setFolds(data);
        setFoldsDatasetId(datasetId);
        setSplitType('standard');

        const initialFold =
          data.find((fold) => (fold.split_type || 'standard') === 'standard')
          ?? data[0];

        setFoldId(initialFold ? String(initialFold.id) : '');
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить folds.');
        }
      });

    return () => {
      active = false;
    };
  }, [datasetId]);

  const datasetFolds = foldsDatasetId === datasetId ? folds : [];
  const availableFolds = datasetFolds.filter(
    (fold) => (fold.split_type || 'standard') === splitType,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    let config: Record<string, unknown>;

    try {
      config = JSON.parse(configText);
      if (!config || Array.isArray(config) || typeof config !== 'object') {
        throw new Error('Configuration must be a JSON object.');
      }
    } catch {
      setError('Проверьте JSON-конфигурацию. Ожидается JSON object.');
      return;
    }

    const parsedNUsers = nUsers.trim() === '' ? null : Number(nUsers);
    const parsedTopk = Number(topk);
    const parsedSeed = Number(seed);

    if (
      parsedNUsers !== null &&
      (!Number.isSafeInteger(parsedNUsers) || parsedNUsers < 1 || parsedNUsers > 500)
    ) {
      setError('Количество пользователей должно быть целым числом от 1 до 500.');
      return;
    }

    if (!Number.isSafeInteger(parsedTopk) || parsedTopk < 1 || parsedTopk > 100) {
      setError('Top-K должен быть целым числом от 1 до 100.');
      return;
    }

    if (!Number.isSafeInteger(parsedSeed) || parsedSeed < 0) {
      setError('Random seed должен быть неотрицательным целым числом.');
      return;
    }

    if (new TextEncoder().encode(configText).length > 64 * 1024) {
      setError('Размер JSON-конфигурации не должен превышать 64 KiB.');
      return;
    }

    if (!foldId) {
      setError('Для выбранного датасета нет доступных folds.');
      return;
    }

    setLoading(true);

    try {
      const selectedFold = datasetFolds.find((fold) => fold.id === Number(foldId));

      const experiment = await labApi.createExperiment({
        name,
        description,
        draft_config: {
          dataset_id: Number(datasetId),
          dataset_fold: Number(foldId),
          split_type: splitType,
          config,
          seed: Number(seed),
          split_seed: selectedFold?.split_seed ?? Number(seed),
          init_seed: Number(seed),
          n_users: nUsers.trim() ? Number(nUsers) : null,
          topk: Number(topk),
        },
      });

      router.push(`/lab/experiments/${experiment.id}`);
    } catch (err) {
      setError(
        err instanceof LabApiError
          ? err.message
          : 'Не удалось создать эксперимент.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <LabShell>
      <div className="max-w-4xl">
        <p className="text-sm tracking-[0.2em] text-[#00d1b2] font-bold">
          EXPERIMENT DESIGN
        </p>
        <h1 className="text-4xl font-black mt-2">Новый эксперимент</h1>
        <p className="text-[#94a3c4] mt-3 mb-8">
          Создайте исследовательский проект и сохраните конфигурацию первого запуска.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-[#ff5b8c]/40 bg-[#ff5b8c]/10 p-4 text-sm text-[#ff9ab7]">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-6 md:p-8 space-y-7"
        >
          <section>
            <h2 className="font-bold text-lg mb-5">1. Основная информация</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Название эксперимента
                </span>
                <input
                  required
                  maxLength={200}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Например: SCIR — cold-start evaluation"
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Описание
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Цель, гипотеза и описание эксперимента..."
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
                />
              </label>
            </div>
          </section>

          <div className="border-t border-[#26325a]" />

          <section>
            <h2 className="font-bold text-lg mb-5">2. Dataset Registry</h2>

            <div className="mb-5">
              <p className="block text-sm text-[#cbd5e1] mb-3">
                Тип разбиения
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  aria-pressed={splitType === 'standard'}
                  onClick={() => {
                    setSplitType('standard');
                    const next = datasetFolds.find(
                      (fold) => (fold.split_type || 'standard') === 'standard',
                    );
                    setFoldId(next ? String(next.id) : '');
                  }}
                  disabled={!datasetFolds.some(
                    (fold) => (fold.split_type || 'standard') === 'standard',
                  )}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${
                    splitType === 'standard'
                      ? 'border-[#00d1b2] bg-[#00d1b2]/10 text-[#00d1b2]'
                      : 'border-[#334269] text-[#94a3c4] hover:border-[#00d1b2]'
                  }`}
                >
                  Standard split
                </button>

                <button
                  type="button"
                  aria-pressed={splitType === 'user_kfold'}
                  onClick={() => {
                    setSplitType('user_kfold');
                    const next = datasetFolds.find(
                      (fold) => fold.split_type === 'user_kfold',
                    );
                    setFoldId(next ? String(next.id) : '');
                  }}
                  disabled={!datasetFolds.some(
                    (fold) => fold.split_type === 'user_kfold',
                  )}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${
                    splitType === 'user_kfold'
                      ? 'border-[#00d1b2] bg-[#00d1b2]/10 text-[#00d1b2]'
                      : 'border-[#334269] text-[#94a3c4] hover:border-[#00d1b2]'
                  }`}
                >
                  User K-Fold
                </button>
              </div>
            </div>

            {loadingDatasets ? (
              <p className="text-sm text-[#94a3c4]">Загрузка датасетов...</p>
            ) : datasets.length === 0 ? (
              <div className="rounded-xl border border-[#ff5b8c]/30 bg-[#ff5b8c]/5 p-4 text-sm text-[#ff9ab7]">
                Нет активных датасетов. Сначала администратор должен зарегистрировать датасет и его folds в Django Admin.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="block text-sm text-[#cbd5e1] mb-2">
                    Датасет
                  </span>
                  <select
                    required
                    value={datasetId}
                    onChange={(event) => setDatasetId(event.target.value)}
                    className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3"
                  >
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name} · {dataset.version}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm text-[#cbd5e1] mb-2">
                    Dataset fold
                  </span>
                  <select
                    required
                    value={foldId}
                    onChange={(event) => setFoldId(event.target.value)}
                    disabled={!availableFolds.length}
                    className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 disabled:opacity-50"
                  >
                    {availableFolds.map((fold) => (
                      <option key={fold.id} value={fold.id}>
                        Fold {fold.fold_index} · seed {fold.split_seed}
                        {fold.test_users_count != null
                          ? ` · ${fold.test_users_count.toLocaleString()} users`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {availableFolds.length > 0 ? (
              <p className="text-xs text-[#64748b] mt-3">
                {availableFolds.length} доступных folds для выбранного типа разбиения.
              </p>
            ) : !loadingDatasets && datasetId ? (
              <p className="text-sm text-[#ff9ab7] mt-3">
                Для выбранного датасета нет folds этого типа разбиения.
              </p>
            ) : null}
          </section>

          <div className="border-t border-[#26325a]" />

          <section>
            <h2 className="font-bold text-lg mb-5">3. Параметры запуска</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Количество пользователей
                </span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="1"
                  value={nUsers}
                  onChange={(event) => setNUsers(event.target.value)}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Top-K
                </span>
                <input
                  required
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={topk}
                  onChange={(event) => setTopk(event.target.value)}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Random seed
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={seed}
                  onChange={(event) => setSeed(event.target.value)}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3"
                />
              </label>
            </div>
          </section>

          <div className="border-t border-[#26325a]" />

          <section>
            <h2 className="font-bold text-lg mb-2">4. Конфигурация алгоритма</h2>
            <p className="text-xs text-[#64748b] mb-4">
              Конфигурация сохраняется в эксперименте. При каждом запуске будет создан отдельный неизменяемый снимок.
            </p>
            <textarea
              required
              rows={7}
              value={configText}
              onChange={(event) => setConfigText(event.target.value)}
              spellCheck={false}
              className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 font-mono text-sm text-[#a5f3e5] outline-none focus:border-[#00d1b2]"
            />
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/lab/dashboard')}
              className="rounded-lg border border-[#334269] px-6 py-3 text-[#94a3c4] hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                loadingDatasets ||
                !datasets.length ||
                !foldId ||
                !availableFolds.length
              }
              className="rounded-lg bg-[#00d1b2] px-7 py-3 font-bold text-[#070b16] hover:bg-[#43e8ce] disabled:opacity-40"
            >
              {loading ? 'Сохранение...' : 'Сохранить эксперимент'}
            </button>
          </div>
        </form>
      </div>
    </LabShell>
  );
}

export default function NewExperimentPage() {
  return (
    <RequireLabAuth>
      <BuilderContent />
    </RequireLabAuth>
  );
}
