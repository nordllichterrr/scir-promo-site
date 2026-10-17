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
    <main className="flex flex-col min-h-screen bg-white">
      
      {/* 1. HERO SECTION - ЕДИНСТВЕННЫЙ ЛОГОТИП */}
      <section id="hero" className="w-full py-24 bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-5xl flex flex-col items-center gap-10">
          
          {/* Тут только одна картинка логотипа, никаких кругов */}
          <img 
            src="/logo.jpg" 
            alt="SCIR Logo" 
            className="w-[80%] md:w-[60%] max-w-3xl h-auto object-contain" 
          />
          
          <div className="flex flex-col items-center gap-6 mt-6">
            <p className="text-2xl md:text-4xl text-[#2EC4A6] font-black tracking-wide uppercase">Ranking without History</p>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl leading-relaxed font-medium">
              Индуктивный алгоритм рекомендаций для холодного старта. <br className="hidden md:block"/>
              Мы возвращаем системам способность работать там, где истории ещё нет.
            </p>
          </div>

          <div className="flex gap-6 justify-center flex-wrap mt-8">
            <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="bg-[#F0A6CA] text-[#1B1F3B] px-10 py-5 rounded-2xl font-black text-xl hover:bg-pink-400 transition shadow-lg hover:-translate-y-1">
              Скачать репозиторий
            </a>
            <a href="#contact" className="border-2 border-[#2EC4A6] text-[#2EC4A6] px-10 py-5 rounded-2xl font-black text-xl hover:bg-[#2EC4A6] hover:text-white transition shadow-lg hover:-translate-y-1">
              Оставить заявку
            </a>
          </div>
        </div>
      </section>

      {/* 2. ЦИФРЫ ПРОЕКТА */}
      <section className="w-full py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-[#1B1F3B] border-l-8 border-[#8B5CF6] pl-6">Цифры проекта</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="bg-white rounded-2xl p-10 border-t-8 border-[#2EC4A6] shadow-lg">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">0.548</div>
              <div className="text-lg text-gray-500 font-bold">HR@10 на MovieLens-25M</div>
            </div>
            <div className="bg-white rounded-2xl p-10 border-t-8 border-[#8B5CF6] shadow-lg">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">0.1243</div>
              <div className="text-lg text-gray-500 font-bold">nDCG@10 на MovieLens-25M</div>
            </div>
            <div className="bg-white rounded-2xl p-10 border-t-8 border-[#F0A6CA] shadow-lg">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">1.8 мс</div>
              <div className="text-lg text-gray-500 font-bold">Задержка на CPU</div>
            </div>
            <div className="bg-white rounded-2xl p-10 border-t-8 border-[#2EC4A6] shadow-lg">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">3400×</div>
              <div className="text-lg text-gray-500 font-bold">Быстрее кросс-энкодера</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. АЛГОРИТМ */}
      <section id="algorithm" className="w-full py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-[#1B1F3B] border-l-8 border-[#8B5CF6] pl-6">Как работает алгоритм</h2>
          
          <div className="bg-gray-50 text-[#1B1F3B] p-12 rounded-2xl font-mono text-lg md:text-2xl overflow-x-auto mb-12 border border-gray-200 shadow-inner">
             <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-loose max-w-5xl font-medium">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

      {/* 4. РЕЗУЛЬТАТЫ */}
      <section id="results" className="w-full py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-[#1B1F3B] border-l-8 border-[#8B5CF6] pl-6">Результаты</h2>
          
          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white text-black">
            <table className="w-full text-lg md:text-2xl text-left border-collapse">
              <thead className="bg-[#1B1F3B] text-white">
                <tr>
                  <th className="px-8 py-6 font-bold">Модель</th>
                  <th className="px-8 py-6 font-bold">HR@10</th>
                  <th className="px-8 py-6 font-bold">nDCG@10</th>
                  <th className="px-8 py-6 font-bold">Задержка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.model} className={r.highlight ? 'bg-[#F0A6CA] font-black text-[#1B1F3B]' : 'hover:bg-gray-50 transition-colors text-gray-700'}>
                    <td className="px-8 py-6">{r.model}</td>
                    <td className="px-8 py-6">{r.hr}</td>
                    <td className="px-8 py-6">{r.ndcg}</td>
                    <td className="px-8 py-6">{r.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. ДЛЯ КОГО */}
      <section id="audience" className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-[#1B1F3B] border-l-8 border-[#8B5CF6] pl-6">Для кого этот проект</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="bg-gray-50 rounded-2xl p-10 border-l-8 border-[#2EC4A6] shadow-md">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">01</div>
              <div className="text-xl text-gray-700 font-bold">Исследователи ML</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-10 border-l-8 border-[#8B5CF6] shadow-md">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">02</div>
              <div className="text-xl text-gray-700 font-bold">Инженеры продакшена</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-10 border-l-8 border-[#F0A6CA] shadow-md">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">03</div>
              <div className="text-xl text-gray-700 font-bold">Продуктовые аналитики</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-10 border-l-8 border-[#2EC4A6] shadow-md">
              <div className="text-5xl font-black text-[#8B5CF6] mb-4">04</div>
              <div className="text-xl text-gray-700 font-bold">Корпоративные клиенты</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ФОРМА */}
      <section id="contact" className="w-full py-24 bg-[#2EC4A6]/10 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8">
          <B2BForm />
        </div>
      </section>

      {/* 7. FOOTER (Без логотипа, только текст) */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-2xl font-black text-[#1B1F3B] mb-4">SCIR</h4>
            <p className="text-lg text-gray-500">Ranking without History</p>
          </div>
          <div>
            <h4 className="text-2xl font-black text-[#1B1F3B] mb-4">Разделы</h4>
            <ul className="text-lg text-gray-500 space-y-3">
              <li><a href="#hero" className="hover:text-[#8B5CF6] transition">О проекте</a></li>
              <li><a href="#algorithm" className="hover:text-[#8B5CF6] transition">Алгоритм</a></li>
              <li><a href="#results" className="hover:text-[#8B5CF6] transition">Результаты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-black text-[#1B1F3B] mb-4">Ресурсы</h4>
            <ul className="text-lg text-gray-500 space-y-3">
              <li><a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="hover:text-[#8B5CF6] transition">Репозиторий</a></li>
              <li><a href="https://zenodo.org/records/22146633" target="_blank" rel="noopener noreferrer" className="hover:text-[#8B5CF6] transition">Статья</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-black text-[#1B1F3B] mb-4">Контакты</h4>
            <ul className="text-lg text-gray-500 space-y-3">
              <li>lemdyasova68@gmail.com</li>
              <li>zmanovskiy.n.v@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
