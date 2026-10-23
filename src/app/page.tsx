import Formula from '@/components/Formula';
import B2BForm from '@/components/B2BForm';

export default function HomePage() {
  const rows = [
    { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
    { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
    { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
    { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
  ];

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden pb-20">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#5b8cff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HERO SECTION */}
      <section id="hero" className="w-full py-24 relative z-10">
        <div className="w-[90%] max-w-[600px] mx-auto flex flex-col items-center text-center animate-rise">
          <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-tr from-[#00d1b2]/20 via-[#8b5bff]/20 to-transparent flex items-center justify-center relative mb-8 border border-[#26325a] shadow-[0_0_40px_rgba(0,209,178,0.15)]">
            <span className="text-6xl" aria-hidden="true">🦄</span>
            <span className="absolute top-0 right-0 bg-[#ff5b8c] text-[#070b16] font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-[0_0_20px_#ff5b8c]">γ</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white">SCIR</h1>
          <p className="text-[#00d1b2] text-2xl font-bold mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(0,209,178,0.4)]">Ranking without History</p>
          <p className="text-[#94a3c4] text-lg mb-10 leading-relaxed">
            Индуктивный алгоритм рекомендаций для холодного старта. Мы возвращаем системам способность работать там, где истории ещё нет.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#ff5b8c] text-[#070b16] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)]">
              Скачать репозиторий
            </a>
            <a href="#contact" className="border-2 border-[#00d1b2] text-[#00d1b2] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)]">
              Оставить заявку
            </a>
          </div>
        </div>
      </section>

      {/* ЦИФРЫ ПРОЕКТА (Ширина 500px) */}
      <section className="w-full py-16 relative z-10">
        <div className="w-[90%] max-w-[500px] mx-auto animate-rise" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-black mb-10 text-white text-center">Цифры проекта</h2>
          <div className="flex flex-col gap-4">
            <div className="glass-card border-l-4 border-[#00d1b2] py-4 px-6">
              <div className="text-3xl font-black text-[#00d1b2] mb-1 font-mono">0.548</div>
              <div className="text-xs text-[#94a3c4] font-bold uppercase tracking-wider">HR@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-l-4 border-[#5b8cff] py-4 px-6">
              <div className="text-3xl font-black text-[#5b8cff] mb-1 font-mono">0.1243</div>
              <div className="text-xs text-[#94a3c4] font-bold uppercase tracking-wider">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-l-4 border-[#ffb020] py-4 px-6">
              <div className="text-3xl font-black text-[#ffb020] mb-1 font-mono">1.8 мс</div>
              <div className="text-xs text-[#94a3c4] font-bold uppercase tracking-wider">Задержка на CPU</div>
            </div>
            <div className="glass-card border-l-4 border-[#8b5bff] py-4 px-6">
              <div className="text-3xl font-black text-[#8b5bff] mb-1 font-mono">3400×</div>
              <div className="text-xs text-[#94a3c4] font-bold uppercase tracking-wider">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* АЛГОРИТМ (Ширина 600px) */}
      <section id="algorithm" className="w-full py-16 relative z-10">
        <div className="w-[90%] max-w-[600px] mx-auto animate-rise" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-black mb-10 text-white text-center">Как работает алгоритм</h2>
          <div className="glass-card mb-8 flex justify-center overflow-x-auto border border-[#26325a] py-6 px-4">
            <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          <p className="text-base text-[#94a3c4] leading-relaxed text-center">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* РЕЗУЛЬТАТЫ (Ширина 600px) */}
      <section id="results" className="w-full py-16 relative z-10">
        <div className="w-[90%] max-w-[600px] mx-auto animate-rise" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-black mb-10 text-white text-center">Результаты</h2>
          
          <div className="glass-card overflow-hidden p-0 border border-[#26325a]">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1730] text-[#e9edff] border-b border-[#26325a]">
                  <th className="px-4 py-3 font-bold text-center">Модель</th>
                  <th className="px-4 py-3 font-bold text-center">HR@10</th>
                  <th className="px-4 py-3 font-bold text-center">nDCG@10</th>
                  <th className="px-4 py-3 font-bold text-center">Задержка</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#ff5b8c]/10 text-[#ff5b8c] font-bold border-b border-[#26325a]' : 'even:bg-white/5 border-b border-[#26325a] text-[#94a3c4]'}>
                    <td className="px-4 py-3 text-center">{r.model}</td>
                    <td className="px-4 py-3 font-mono text-center">{r.hr}</td>
                    <td className="px-4 py-3 font-mono text-center">{r.ndcg}</td>
                    <td className="px-4 py-3 font-mono text-center">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA БЛОК (Ширина 500px) */}
      <section className="w-full py-20 relative z-10 animate-rise" style={{ animationDelay: '0.4s' }}>
        <div className="w-[90%] max-w-[500px] mx-auto text-center">
          <div className="glass-card">
            <h2 className="text-2xl font-black mb-4 text-white">Готовы попробовать SCIR?</h2>
            <p className="text-base text-[#94a3c4] mb-6">Оставьте заявку на пилот или скачайте репозиторий</p>
            <div className="flex flex-col gap-3">
              <a href="#contact" className="bg-[#ff5b8c] text-[#070b16] px-6 py-3 rounded-xl font-bold hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)]">
                Оставить заявку
              </a>
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-[#00d1b2] text-[#00d1b2] px-6 py-3 rounded-xl font-bold hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)]">
                Скачать репозиторий
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ФОРМА (Ширина 450px) */}
      <section id="contact" className="w-full py-16 relative z-10 animate-rise" style={{ animationDelay: '0.5s' }}>
        <div className="w-[90%] max-w-[450px] mx-auto">
          <B2BForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#070b16]/80 border-t border-[#26325a] py-12 relative z-10 mt-auto">
        <div className="w-[90%] max-w-[600px] mx-auto grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="text-[#00d1b2] font-black mb-3 text-lg tracking-widest flex items-center gap-2">
              <span className="text-xl">🦄</span> SCIR
            </h4>
            <p className="text-[#94a3c4]">Ranking without History</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-base">Разделы</h4>
            <ul className="space-y-2 text-[#94a3c4]">
              <li><a href="#hero" className="hover:text-[#00d1b2] transition">О проекте</a></li>
              <li><a href="#algorithm" className="hover:text-[#00d1b2] transition">Алгоритм</a></li>
              <li><a href="#results" className="hover:text-[#00d1b2] transition">Результаты</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
