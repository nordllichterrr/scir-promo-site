'use client';
import { useState } from 'react';

export default function B2BForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) { setStatus('success'); e.currentTarget.reset(); } else { setStatus('error'); }
    } catch { setStatus('error'); } finally { setLoading(false); }
  }

  return (
    <div className="w-full card-glass rounded-3xl shadow-2xl p-6 md:p-10">
      {status === 'success' && <div className="bg-scir-emerald/20 border border-scir-emerald text-scir-emerald px-6 py-4 rounded-xl mb-6 text-center font-bold text-xl">Заявка отправлена!</div>}
      {status === 'error' && <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-xl mb-6 text-center font-bold text-xl">Ошибка отправки.</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold text-white text-lg mb-2">Имя *</label>
          <input name="name" required className="w-full p-4 text-lg rounded-xl bg-white text-black border-2 border-transparent focus:border-scir-emerald outline-none transition-colors" placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block font-bold text-white text-lg mb-2">Компания *</label>
          <input name="company" required className="w-full p-4 text-lg rounded-xl bg-white text-black border-2 border-transparent focus:border-scir-emerald outline-none transition-colors" placeholder="ООО Ромашка" />
        </div>
        <div>
          <label className="block font-bold text-white text-lg mb-2">Email *</label>
          <input type="email" name="email" required className="w-full p-4 text-lg rounded-xl bg-white text-black border-2 border-transparent focus:border-scir-emerald outline-none transition-colors" placeholder="ivan@company.com" />
        </div>
        <div>
          <label className="block font-bold text-white text-lg mb-2">Сообщение *</label>
          <textarea name="message" required rows={4} className="w-full p-4 text-lg rounded-xl bg-white text-black border-2 border-transparent focus:border-scir-emerald outline-none transition-colors" placeholder="Ваше сообщение..." />
        </div>
        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-scir-amethyst text-white py-4 rounded-xl font-black text-xl hover:bg-purple-600 transition-all shadow-lg">
            {loading ? 'Отправка...' : 'Оставить заявку'}
          </button>
        </div>
      </form>
    </div>
  );
}
