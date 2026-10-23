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
      
      {/* Декоративное свечение на фоне */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#5b8cff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HERO SECTION */}
      <section id="hero" className="w-full py-32 relative z-10">
        <div className="w-full max-w-4xl mx-auto px-8 flex flex-col items-center text-center animate-rise">
          
          {/* Круг с эмодзи и гаммой */}
          <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-[#00d1b2]/20 via-[#8b5bff]/20 to-transparent flex items-center justify-center relative mb-10 border border-[#26325a] shadow-[0_0_40px_rgba(0,209,178,0.15)]">
            <span className="text-8xl" aria-hidden="true">🦄</span>
            <span className="absolute top-2 right-2 bg-[#ff5b8c] text-[#070b16] font-bold rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-[0_0_20px_#ff5b8c]">γ</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-white">
            SCIR
          </h1>
          <p className="text-[#00d1b2] text-3xl font-bold mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(0,209,178,0.4)]">
            Ranking without History
          </p>
          <p className="text-[#94a3c4] text-xl max-w-2xl mb-12 leading-relaxed">
            Индуктивный алгоритм рекомендаций для холодного старта. Мы возвращаем системам способность работать там, где истории ещё нет.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#ff5b8c] text-[#070b16] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)] hover:-translate-y-1">
              Скачать репозиторий
            </a>
            <a href="#contact" className="border-2 border-[#00d1b2] text-[#00d1b2] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)] hover:-translate-y-1">
              Оставить заявку
            </a>
          </div>
        </div>
      </section>

      {/* ЦИФРЫ ПРОЕКТА */}
      <section className="w-full py-24 relative z-10">
        <div className="w-full max-w-6xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-black mb-16 text-white flex items-center justify-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Цифры проекта
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card border-t-4 border-[#00d1b2] p-10 text-center">
              <div className="text-5xl font-black text-[#00d1b2] mb-4 font-mono">0.548</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">HR@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-t-4 border-[#5b8cff] p-10 text-center">
              <div className="text-5xl font-black text-[#5b8cff] mb-4 font-mono">0.1243</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-t-4 border-[#ffb020] p-10 text-center">
              <div className="text-5xl font-black text-[#ffb020] mb-4 font-mono">1.8 мс</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">Задержка на CPU</div>
            </div>
            <div className="glass-card border-t-4 border-[#8b5bff] p-10 text-center">
              <div className="text-5xl font-black text-[#8b5bff] mb-4 font-mono">3400×</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* АЛГОРИТМ */}
      <section id="algorithm" className="w-full py-24 relative z-10">
        <div className="w-full max-w-5xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-black mb-16 text-white flex items-center justify-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Как работает алгоритм
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
          </h2>
          <div className="glass-card p-12 mb-12 flex justify-center overflow-x-auto border border-[#26325a]">
            <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          <p className="text-xl text-[#94a3c4] leading-loose max-w-4xl mx-auto text-center">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* РЕЗУЛЬТАТЫ */}
      <section id="results" className="w-full py-24 relative z-10">
        <div className="w-full max-w-5xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-4xl font-black mb-16 text-white flex items-center justify-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Результаты
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
          </h2>
          
          <div className="glass-card overflow-hidden p-0 border border-[#26325a]">
            <table className="w-full text-lg text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1730] text-[#e9edff] border-b border-[#26325a]">
                  <th className="px-8 py-6 font-bold text-center">Модель</th>
                  <th className="px-8 py-6 font-bold text-center">HR@10</th>
                  <th className="px-8 py-6 font-bold text-center">nDCG@10</th>
                  <th className="px-8 py-6 font-bold text-center">Задержка</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#ff5b8c]/10 text-[#ff5b8c] font-bold border-b border-[#26325a]' : 'even:bg-white/5 border-b border-[#26325a] text-[#94a3c4]'}>
                    <td className="px-8 py-6 text-center">{r.model}</td>
                    <td className="px-8 py-6 font-mono text-center">{r.hr}</td>
                    <td className="px-8 py-6 font-mono text-center">{r.ndcg}</td>
                    <td className="px-8 py-6 font-mono text-center">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA БЛОК */}
      <section className="w-full py-32 relative z-10 animate-rise" style={{ animationDelay: '0.4s' }}>
        <div className="w-full max-w-4xl mx-auto px-8 text-center">
          <div className="glass-card p-16 border border-[#26325a]">
            <h2 className="text-5xl font-black mb-6 text-white">Готовы попробовать SCIR?</h2>
            <p className="text-xl text-[#94a3c4] mb-12">Оставьте заявку на пилот или скачайте репозиторий</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href="#contact" className="bg-[#ff5b8c] text-[#070b16] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)] hover:-translate-y-1">
                Оставить заявку
              </a>
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-[#00d1b2] text-[#00d1b2] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)] hover:-translate-y-1">
                Скачать репозиторий
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section id="contact" className="w-full py-24 relative z-10 animate-rise" style={{ animationDelay: '0.5s' }}>
        <div className="w-full max-w-3xl mx-auto px-8">
          <B2BForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#070b16]/80 border-t border-[#26325a] py-16 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          <div>
            <h4 className="text-[#00d1b2] font-black mb-4 text-xl tracking-widest flex items-center gap-2">
              <span className="text-2xl">🦄</span> SCIR
            </h4>
            <p className="text-[#94a3c4]">Ranking without History</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Разделы</h4>
            <ul className="space-y-3 text-[#94a3c4]">
              <li><a href="#hero" className="hover:text-[#00d1b2] transition">О проекте</a></li>
              <li><a href="#algorithm" className="hover:text-[#00d1b2] transition">Алгоритм</a></li>
              <li><a href="#results" className="hover:text-[#00d1b2] transition">Результаты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Ресурсы</h4>
            <ul className="space-y-3 text-[#94a3c4]">
              <li><a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="hover:text-[#00d1b2] transition">Репозиторий</a></li>
              <li><a href="https://zenodo.org/records/22146633" target="_blank" className="hover:text-[#00d1b2] transition">Статья</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Контакты</h4>
            <ul className="space-y-3 text-[#94a3c4]">
              <li>lemdyasova68@gmail.com</li>
              <li>zmanovskiy.n.v@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
