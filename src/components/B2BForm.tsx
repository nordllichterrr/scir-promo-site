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
      <h2 className="text-2xl font-black mb-8 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-4 flex items-center">
        Оставить заявку
      </h2>
      {status === 'success' && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 font-bold">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-10 text-black">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-bold text-lg">Имя *</label>
            <div className="md:col-span-2">
              <input name="name" required className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="Иван Иванов" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-bold text-lg">Компания *</label>
            <div className="md:col-span-2">
              <input name="company" required className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="ООО Ромашка" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-6">
            <label className="font-bold text-lg">Email *</label>
            <div className="md:col-span-2">
              <input type="email" name="email" required className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="ivan@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-200 pb-6">
            <label className="font-bold text-lg mt-3">Сообщение *</label>
            <div className="md:col-span-2">
              <textarea name="message" required rows={4} className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="Ваше сообщение..." />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} className="bg-[#F0A6CA] text-[#1B1F3B] px-8 py-3 rounded-lg font-bold text-lg hover:bg-pink-400 transition shadow-md">
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
