'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { LabUser, labApi } from '@/lib/lab/api';

type AuthContextType = {
  user: LabUser | null;
  loading: boolean;
  authError: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function LabAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<LabUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setAuthError(false);

    try {
      const result = await labApi.me();
      setUser(result.authenticated ? result.user : null);
    } catch (error) {
      setAuthError(true);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    labApi.me()
      .then((result) => {
        if (active) {
          setUser(result.authenticated ? result.user : null);
          setAuthError(false);
        }
      })
      .catch(() => {
        if (active) setAuthError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    await labApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useLabAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useLabAuth must be used inside LabAuthProvider');
  }

  return context;
}

export function RequireLabAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, authError, refresh } = useLabAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !authError) {
      router.replace('/lab/login');
    }
  }, [loading, user, authError, router]);

  if (authError && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#94a3c4]">
        <p>Не удалось проверить сессию. Проверьте соединение с сервером.</p>
        <button
          onClick={() => refresh().catch(() => {})}
          className="rounded-lg bg-[#00d1b2] px-5 py-2 font-bold text-[#070b16]"
        >
          Повторить проверку
        </button>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#94a3c4]">
        Проверка сессии...
      </div>
    );
  }

  return <>{children}</>;
}
