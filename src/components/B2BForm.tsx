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
      {status === 'success' && <div className="bg-green-500 text-white px-6 py-4 rounded-xl mb-6 text-center font-bold text-xl shadow-lg">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-white/20 p-6 md:p-10 text-black">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-black text-xl">Имя *</label>
            <div className="md:col-span-2">
              <input name="name" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-scir-emerald outline-none" placeholder="Иван Иванов" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-black text-xl">Компания *</label>
            <div className="md:col-span-2">
              <input name="company" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-scir-emerald outline-none" placeholder="ООО Ромашка" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-black text-xl">Email *</label>
            <div className="md:col-span-2">
              <input type="email" name="email" required className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-scir-emerald outline-none" placeholder="ivan@company.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-200 pb-6">
            <label className="font-black text-xl mt-4">Сообщение *</label>
            <div className="md:col-span-2">
              <textarea name="message" required rows={4} className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-scir-emerald outline-none" placeholder="Ваше сообщение..." />
            </div>
          </div>

          {/* ОГРОМНАЯ КНОПКА ОСТАВИТЬ ЗАЯВКУ */}
          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full bg-scir-amethyst text-white py-6 rounded-2xl font-black text-2xl hover:bg-purple-600 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              {loading ? 'Отправка...' : 'Оставить заявку'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
