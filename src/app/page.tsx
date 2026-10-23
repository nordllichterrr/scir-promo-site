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

      {/* HERO SECTION (Увеличенные отступы py-24) */}
      <section id="hero" className="w-full py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16 animate-rise">
          
          {/* Круг с логотипом */}
          <div className="w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-[#00d1b2]/20 via-[#8b5bff]/20 to-transparent flex items-center justify-center relative flex-shrink-0 border border-[#26325a] shadow-[0_0_40px_rgba(0,209,178,0.15)]">
            <img src="/logo.jpg" alt="SCIR" className="w-40 h-40 object-cover rounded-full drop-shadow-xl" />
            <span className="absolute top-2 right-2 bg-[#ff5b8c] text-[#070b16] font-bold rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-[0_0_20px_#ff5b8c]">γ</span>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white">
              SCIR
            </h1>
            <p className="text-[#00d1b2] text-2xl font-bold mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(0,209,178,0.3)]">
              Ranking without History
            </p>
            <p className="text-[#94a3c4] text-xl max-w-xl mb-10 leading-relaxed">
              Индуктивный алгоритм рекомендаций для холодного старта. Мы возвращаем системам способность работать там, где истории ещё нет.
            </p>
            <div className="flex gap-6 justify-center md:justify-start flex-wrap">
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#ff5b8c] text-[#070b16] px-10 py-4 rounded-xl font-black text-lg hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)]">
                Скачать репозиторий
              </a>
              <a href="#contact" className="border-2 border-[#00d1b2] text-[#00d1b2] px-10 py-4 rounded-xl font-black text-lg hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)]">
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ЦИФРЫ ПРОЕКТА (Увеличенные отступы py-20) */}
      <section className="w-full py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-black mb-12 text-white flex items-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Цифры проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card border-l-4 border-[#00d1b2] p-8">
              <div className="text-5xl font-black text-[#00d1b2] mb-3 font-mono">0.548</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">HR@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-l-4 border-[#5b8cff] p-8">
              <div className="text-5xl font-black text-[#5b8cff] mb-3 font-mono">0.1243</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="glass-card border-l-4 border-[#ffb020] p-8">
              <div className="text-5xl font-black text-[#ffb020] mb-3 font-mono">1.8 мс</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">Задержка на CPU</div>
            </div>
            <div className="glass-card border-l-4 border-[#8b5bff] p-8">
              <div className="text-5xl font-black text-[#8b5bff] mb-3 font-mono">3400×</div>
              <div className="text-sm text-[#94a3c4] font-bold uppercase tracking-wider">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* АЛГОРИТМ (Увеличенные отступы py-20) */}
      <section id="algorithm" className="w-full py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-black mb-12 text-white flex items-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Как работает алгоритм
          </h2>
          <div className="glass-card p-10 mb-10 flex justify-center overflow-x-auto border border-[#26325a]">
            <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          <p className="text-xl text-[#94a3c4] leading-loose max-w-4xl">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* РЕЗУЛЬТАТЫ (Увеличенные отступы py-20) */}
      <section id="results" className="w-full py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-8 animate-rise" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-4xl font-black mb-12 text-white flex items-center gap-4">
            <span className="w-2 h-10 bg-[#8b5bff] rounded-full inline-block shadow-[0_0_10px_#8b5bff]"></span>
            Результаты
          </h2>
          
          <div className="glass-card overflow-hidden p-0 border border-[#26325a]">
            <table className="w-full text-lg text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1730] text-[#e9edff] border-b border-[#26325a]">
                  <th className="px-8 py-6 font-bold">Модель</th>
                  <th className="px-8 py-6 font-bold">HR@10</th>
                  <th className="px-8 py-6 font-bold">nDCG@10</th>
                  <th className="px-8 py-6 font-bold">Задержка</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#ff5b8c]/10 text-[#ff5b8c] font-bold border-b border-[#26325a]' : 'even:bg-white/5 border-b border-[#26325a] text-[#94a3c4]'}>
                    <td className="px-8 py-6">{r.model}</td>
                    <td className="px-8 py-6 font-mono">{r.hr}</td>
                    <td className="px-8 py-6 font-mono">{r.ndcg}</td>
                    <td className="px-8 py-6 font-mono">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA БЛОК (Увеличенные отступы py-24) */}
      <section className="w-full py-24 relative z-10 animate-rise" style={{ animationDelay: '0.4s' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="glass-card p-16 border border-[#26325a]">
            <h2 className="text-5xl font-black mb-6 text-white">Готовы попробовать SCIR?</h2>
            <p className="text-xl text-[#94a3c4] mb-10">Оставьте заявку на пилот или скачайте репозиторий</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href="#contact" className="bg-[#ff5b8c] text-[#070b16] px-10 py-4 rounded-xl font-black text-lg hover:bg-[#ff7ba3] transition shadow-[0_0_20px_rgba(255,91,140,0.4)]">
                Оставить заявку
              </a>
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-[#00d1b2] text-[#00d1b2] px-10 py-4 rounded-xl font-black text-lg hover:bg-[#00d1b2] hover:text-[#070b16] transition shadow-[0_0_20px_rgba(0,209,178,0.2)]">
                Скачать репозиторий
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ФОРМА (Увеличенные отступы py-20) */}
      <section id="contact" className="w-full py-20 relative z-10 animate-rise" style={{ animationDelay: '0.5s' }}>
        <div className="max-w-4xl mx-auto px-8">
          <B2BForm />
        </div>
      </section>

      {/* FOOTER (Увеличенные отступы py-16) */}
      <footer className="w-full bg-[#070b16]/80 border-t border-[#26325a] py-16 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          <div>
            <h4 className="text-[#00d1b2] font-black mb-4 text-xl tracking-widest">SCIR</h4>
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
