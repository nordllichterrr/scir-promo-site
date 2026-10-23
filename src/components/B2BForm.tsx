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
    <div className="w-full glass-card" style={{ cursor: 'default' }}>
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
        <span className="w-1.5 h-6 bg-[#00d1b2] rounded-full inline-block"></span>
        Оставить заявку на пилот
      </h2>
      {status === 'success' && <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6 font-bold">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#94a3c4] mb-2">Имя *</label>
          <input name="name" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white focus:border-[#00d1b2] outline-none transition-colors" placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#94a3c4] mb-2">Компания *</label>
          <input name="company" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white focus:border-[#00d1b2] outline-none transition-colors" placeholder="ООО Ромашка" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#94a3c4] mb-2">Email *</label>
          <input type="email" name="email" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white focus:border-[#00d1b2] outline-none transition-colors" placeholder="ivan@company.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#94a3c4] mb-2">Сообщение *</label>
          <textarea name="message" required rows={4} className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white focus:border-[#00d1b2] outline-none transition-colors" placeholder="Ваше сообщение..." />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full bg-[#00d1b2] text-[#070b16] py-3 rounded-lg font-bold text-lg hover:bg-[#00e5c3] transition shadow-[0_0_15px_rgba(0,209,178,0.3)]">
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </div>
      </form>
    </div>
  );
}
