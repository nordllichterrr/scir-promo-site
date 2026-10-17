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
      <h2 className="text-4xl md:text-5xl font-black mb-12 text-[#1B1F3B] border-l-8 border-[#8B5CF6] pl-6">Оставить заявку</h2>
      {status === 'success' && <div className="bg-green-500 text-white p-6 rounded-xl mb-8 font-bold text-xl">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="bg-[#e6f9f5] rounded-2xl shadow-lg border-2 border-[#2EC4A6] p-8 md:p-14 text-black">
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b-2 border-[#2EC4A6]/20 pb-10">
            <label className="font-black text-2xl">Имя *</label>
            <div className="md:col-span-2">
              <input name="name" required className="w-full p-5 text-xl rounded-xl border-2 border-[#2EC4A6]/50 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="Иван Иванов" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b-2 border-[#2EC4A6]/20 pb-10">
            <label className="font-black text-2xl">Компания *</label>
            <div className="md:col-span-2">
              <input name="company" required className="w-full p-5 text-xl rounded-xl border-2 border-[#2EC4A6]/50 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="ООО Ромашка" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b-2 border-[#2EC4A6]/20 pb-10">
            <label className="font-black text-2xl">Email *</label>
            <div className="md:col-span-2">
              <input type="email" name="email" required className="w-full p-5 text-xl rounded-xl border-2 border-[#2EC4A6]/50 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="ivan@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b-2 border-[#2EC4A6]/20 pb-10">
            <label className="font-black text-2xl mt-4">Сообщение *</label>
            <div className="md:col-span-2">
              <textarea name="message" required rows={5} className="w-full p-5 text-xl rounded-xl border-2 border-[#2EC4A6]/50 bg-white focus:border-[#8B5CF6] outline-none transition-colors" placeholder="Ваше сообщение..." />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="bg-[#1B1F3B] text-white px-12 py-5 rounded-xl font-black text-2xl hover:bg-[#8B5CF6] transition shadow-xl hover:scale-105">
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
