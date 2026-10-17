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
    <div className="w-full">
      {status === 'success' && <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6 text-center font-bold text-xl">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-10 text-black">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-6">
            <label className="font-black text-xl">Имя *</label>
            <div className="md:col-span-2">
              <input name="name" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-scir-emerald outline-none transition-colors" placeholder="Иван Иванов" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-6">
            <label className="font-black text-xl">Компания *</label>
            <div className="md:col-span-2">
              <input name="company" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-scir-emerald outline-none transition-colors" placeholder="ООО Ромашка" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-6">
            <label className="font-black text-xl">Email *</label>
            <div className="md:col-span-2">
              <input type="email" name="email" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-scir-emerald outline-none transition-colors" placeholder="ivan@company.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-100 pb-6">
            <label className="font-black text-xl mt-4">Сообщение *</label>
            <div className="md:col-span-2">
              <textarea name="message" required rows={4} className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-scir-emerald outline-none transition-colors" placeholder="Ваше сообщение..." />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full bg-scir-indigo text-white py-5 rounded-2xl font-black text-2xl hover:bg-scir-amethyst hover:scale-[1.01] transition-all shadow-md">
              {loading ? 'Отправка...' : 'Оставить заявку'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
