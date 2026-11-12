'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LabApiError, labApi } from '@/lib/lab/api';
import { useLabAuth } from './LabAuth';

export default function AuthForm({
  mode,
}: {
  mode: 'login' | 'register';
}) {
  const router = useRouter();
  const { refresh } = useLabAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (isRegister && password !== passwordConfirm) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await labApi.register({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        });
      } else {
        await labApi.login({ username, password });
      }

      await refresh();
      router.replace('/lab/dashboard');
    } catch (err) {
      setError(
        err instanceof LabApiError
          ? err.message
          : 'Не удалось выполнить запрос. Проверьте соединение с сервером.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b16] text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/lab" className="block text-center mb-8">
          <span className="text-5xl">🦄</span>
          <span className="block mt-3 text-2xl font-black tracking-[0.2em]">
            SCIR <span className="text-[#00d1b2]">LAB</span>
          </span>
          <span className="text-xs text-[#64748b]">Research workspace</span>
        </Link>

        <section className="rounded-2xl border border-[#26325a] bg-[#0d1529] p-8 shadow-2xl">
          <h1 className="text-2xl font-bold mb-2">
            {isRegister ? 'Создание аккаунта' : 'Вход в лабораторию'}
          </h1>
          <p className="text-sm text-[#94a3c4] mb-7">
            {isRegister
              ? 'Создайте аккаунт для работы с экспериментами SCIR.'
              : 'Войдите, чтобы продолжить исследовательскую работу.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm text-[#cbd5e1] mb-2">
                Имя пользователя
              </span>
              <input
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
              />
            </label>

            {isRegister && (
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Email
                </span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
                />
              </label>
            )}

            <label className="block">
              <span className="block text-sm text-[#cbd5e1] mb-2">
                Пароль
              </span>
              <input
                required
                type="password"
                minLength={isRegister ? 12 : undefined}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
              />
              {isRegister && (
                <span className="block mt-1 text-xs text-[#64748b]">
                  Не менее 12 символов.
                </span>
              )}
            </label>

            {isRegister && (
              <label className="block">
                <span className="block text-sm text-[#cbd5e1] mb-2">
                  Повторите пароль
                </span>
                <input
                  required
                  type="password"
                  minLength={12}
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  className="w-full rounded-lg border border-[#334269] bg-[#070b16] px-4 py-3 outline-none focus:border-[#00d1b2]"
                />
              </label>
            )}

            {error && (
              <div className="rounded-lg border border-[#ff5b8c]/40 bg-[#ff5b8c]/10 px-4 py-3 text-sm text-[#ff9ab7]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00d1b2] py-3 font-bold text-[#070b16] transition hover:bg-[#43e8ce] disabled:opacity-50"
            >
              {loading
                ? 'Подождите...'
                : isRegister
                  ? 'Создать аккаунт'
                  : 'Войти'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#94a3c4]">
            {isRegister ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}{' '}
            <Link
              href={isRegister ? '/lab/login' : '/lab/register'}
              className="text-[#00d1b2] hover:underline"
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </Link>
          </p>
        </section>

        <Link
          href="/"
          className="block mt-6 text-center text-sm text-[#64748b] hover:text-white"
        >
          ← На сайт SCIR
        </Link>
      </div>
    </main>
  );
}
