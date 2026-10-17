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
    <main className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section id="hero" className="w-full bg-gradient-to-br from-[#1B1F3B] to-[#252a52] text-[#F0F4F8] py-20">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          
          {/* Круг с логотипом и гаммой */}
          <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-[#2EC4A6] via-[#8B5CF6] to-transparent flex items-center justify-center relative flex-shrink-0">
            <span className="text-6xl" aria-hidden="true">🦄</span>
            <span className="absolute top-[20%] right-[30%] bg-[#F0A6CA] text-[#1B1F3B] font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl">γ</span>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-[8px] mb-3 text-[#F0F4F8]">SCIR</h1>
            <p className="text-[#2EC4A6] text-lg font-bold mb-6">Ranking without History</p>
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#F0A6CA] text-[#1B1F3B] px-7 py-3 rounded-lg font-bold hover:bg-pink-300 transition shadow-lg">
                Скачать репозиторий
              </a>
              <a href="#contact" className="border-2 border-[#2EC4A6] text-[#F0F4F8] px-7 py-3 rounded-lg font-bold hover:bg-[#2EC4A6] hover:text-[#1B1F3B] transition shadow-lg">
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ЦИФРЫ ПРОЕКТА */}
      <section className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-[#1B1F3B] flex items-center gap-3">
            <span className="w-1.5 h-7 bg-[#8B5CF6] rounded-full inline-block"></span>
            Цифры проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">0.548</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">HR@10 на MovieLens-25M</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#8B5CF6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">0.1243</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#F0A6CA]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">1.8 мс</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Задержка на CPU</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">3400×</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* АЛГОРИТМ */}
      <section id="algorithm" className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-[#1B1F3B] flex items-center gap-3">
            <span className="w-1.5 h-7 bg-[#8B5CF6] rounded-full inline-block"></span>
            Как работает алгоритм
          </h2>
          <div className="bg-[#1B1F3B] text-[#2EC4A6] p-8 rounded-xl font-mono text-lg overflow-x-auto mb-8 shadow-md flex justify-center">
            <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* РЕЗУЛЬТАТЫ */}
      <section id="results" className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-[#1B1F3B] flex items-center gap-3">
            <span className="w-1.5 h-7 bg-[#8B5CF6] rounded-full inline-block"></span>
            Результаты
          </h2>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-base text-left border-collapse">
              <thead>
                <tr className="bg-[#1B1F3B] text-[#F0F4F8]">
                  <th className="px-6 py-4 font-semibold">Модель</th>
                  <th className="px-6 py-4 font-semibold">HR@10</th>
                  <th className="px-6 py-4 font-semibold">nDCG@10</th>
                  <th className="px-6 py-4 font-semibold">Задержка</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#F0A6CA] font-bold text-[#1B1F3B]' : 'even:bg-[#F0F4F8] border-b border-gray-100 text-[#1B1F3B]'}>
                    <td className="px-6 py-4">{r.model}</td>
                    <td className="px-6 py-4">{r.hr}</td>
                    <td className="px-6 py-4">{r.ndcg}</td>
                    <td className="px-6 py-4">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-[#1B1F3B] flex items-center gap-3">
            <span className="w-1.5 h-7 bg-[#8B5CF6] rounded-full inline-block"></span>
            Для кого этот проект
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">01</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Исследователи ML</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#8B5CF6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">02</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Инженеры продакшена</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#F0A6CA]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">03</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Продуктовые аналитики</div>
            </div>
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#2EC4A6]">
              <div className="text-3xl font-bold text-[#8B5CF6] mb-2">04</div>
              <div className="text-sm text-[#1B1F3B] opacity-75">Корпоративные клиенты</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA БЛОК */}
      <section className="w-full py-20 bg-[#1B1F3B] text-[#F0F4F8] text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4">Готовы попробовать SCIR?</h2>
          <p className="text-lg opacity-85 mb-8">Оставьте заявку на пилот или скачайте репозиторий</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#contact" className="bg-[#F0A6CA] text-[#1B1F3B] px-8 py-3 rounded-lg font-bold hover:bg-pink-300 transition shadow-lg">
              Оставить заявку
            </a>
            <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-[#2EC4A6] text-[#F0F4F8] px-8 py-3 rounded-lg font-bold hover:bg-[#2EC4A6] hover:text-[#1B1F3B] transition shadow-lg">
              Скачать репозиторий
            </a>
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section id="contact" className="w-full py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <B2BForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#1B1F3B] text-[#F0F4F8] py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-between gap-8 text-sm">
          <div>
            <h4 className="text-[#2EC4A6] font-bold mb-3 text-base">SCIR</h4>
            <p className="opacity-75">Ranking without History</p>
          </div>
          <div>
            <h4 className="text-[#2EC4A6] font-bold mb-3 text-base">Разделы</h4>
            <ul className="space-y-2 opacity-75">
              <li><a href="#hero" className="hover:opacity-100 hover:text-white transition">О проекте</a></li>
              <li><a href="#algorithm" className="hover:opacity-100 hover:text-white transition">Алгоритм</a></li>
              <li><a href="#results" className="hover:opacity-100 hover:text-white transition">Результаты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#2EC4A6] font-bold mb-3 text-base">Ресурсы</h4>
            <ul className="space-y-2 opacity-75">
              <li><a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="hover:opacity-100 hover:text-white transition">Репозиторий</a></li>
              <li><a href="https://zenodo.org/records/22146633" target="_blank" className="hover:opacity-100 hover:text-white transition">Статья</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#2EC4A6] font-bold mb-3 text-base">Контакты</h4>
            <ul className="space-y-2 opacity-75">
              <li>lemdyasova68@gmail.com</li>
              <li>zmanovskiy.n.v@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
