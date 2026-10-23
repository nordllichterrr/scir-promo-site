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
    <div className="w-full glass-card border border-[#26325a] p-6" style={{ cursor: 'default' }}>
      <h2 className="text-xl font-black mb-6 text-white text-center">Оставить заявку</h2>
      {status === 'success' && <div className="bg-[#3ddc84]/20 border border-[#3ddc84] text-[#3ddc84] p-3 rounded-lg mb-4 text-sm font-bold text-center">Заявка отправлена!</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#94a3c4] mb-1 uppercase tracking-wider">Имя *</label>
          <input name="name" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white text-sm focus:border-[#00d1b2] outline-none transition-colors" placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#94a3c4] mb-1 uppercase tracking-wider">Компания *</label>
          <input name="company" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white text-sm focus:border-[#00d1b2] outline-none transition-colors" placeholder="ООО Ромашка" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#94a3c4] mb-1 uppercase tracking-wider">Email *</label>
          <input type="email" name="email" required className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white text-sm focus:border-[#00d1b2] outline-none transition-colors" placeholder="ivan@company.com" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#94a3c4] mb-1 uppercase tracking-wider">Сообщение *</label>
          <textarea name="message" required rows={3} className="w-full p-3 rounded-lg bg-[#0f1730] border border-[#26325a] text-white text-sm focus:border-[#00d1b2] outline-none transition-colors" placeholder="Ваше сообщение..." />
        </div>
        <div className="pt-1">
          <button type="submit" disabled={loading} className="w-full bg-[#00d1b2] text-[#070b16] py-3 rounded-lg font-black text-base hover:bg-[#00e5c3] transition shadow-[0_0_20px_rgba(0,209,178,0.4)]">
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
}
