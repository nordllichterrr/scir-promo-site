import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      
      {/* ТЕМНО-СИНИЙ HERO-БЛОК */}
      <section className="bg-[#1B1F3B] w-full">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
          
          {/* Круг с логотипом и гаммой */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#2EC4A6]/30 via-[#8B5CF6]/30 to-transparent flex items-center justify-center relative flex-shrink-0 border border-white/10">
            <img src="/logo.jpg" alt="SCIR" className="w-32 h-32 object-cover rounded-full" />
            <span className="absolute -top-2 -right-2 bg-[#F0A6CA] text-[#1B1F3B] font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">γ</span>
          </div>
          
          {/* Текст и кнопки */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-white mb-2">SCIR</h1>
            <p className="text-[#2EC4A6] text-xl font-bold mb-8">Ranking without History</p>
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" rel="noopener noreferrer" className="bg-[#F0A6CA] text-[#1B1F3B] px-6 py-3 rounded-lg font-bold hover:bg-pink-400 transition shadow-md">
                Скачать репозиторий
              </a>
              <Link href="/contact" className="border-2 border-[#2EC4A6] text-[#2EC4A6] px-6 py-3 rounded-lg font-bold hover:bg-[#2EC4A6] hover:text-[#1B1F3B] transition shadow-md">
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* БЕЛЫЙ БЛОК С ЦИФРАМИ */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-6 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-3 flex items-center">
            Цифры проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-gray-50 rounded-xl p-5 border-t-4 border-[#2EC4A6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">0.548</div>
              <div className="text-xs text-gray-500 font-medium">HR@10 на MovieLens-25M</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border-t-4 border-[#2EC4A6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">0.1243</div>
              <div className="text-xs text-gray-500 font-medium">nDCG@10 на MovieLens-25M</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border-t-4 border-[#F0A6CA]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">1.8 мс</div>
              <div className="text-xs text-gray-500 font-medium">Задержка на CPU</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border-t-4 border-[#2EC4A6]">
              <div className="text-3xl font-black text-[#8B5CF6] mb-1">3400×</div>
              <div className="text-xs text-gray-500 font-medium">Быстрее кросс-энкодера</div>
            </div>

          </div>
        </div>
      </section>

      {/* БЛОК АЛГОРИТМА (продолжение страницы) */}
      <section className="w-full bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-6 text-[#1B1F3B] border-l-4 border-[#8B5CF6] pl-3 flex items-center">
            Как работает алгоритм
          </h2>
          <div className="bg-[#1B1F3B] text-[#2EC4A6] p-6 rounded-xl font-mono text-sm md:text-base overflow-x-auto mb-6 shadow-inner">
             s(u,i) = (1 − <span className="text-[#F0A6CA] font-bold">γ(u)</span>)·⟨u, e_i⟩ + <span className="text-[#F0A6CA] font-bold">γ(u)</span>·log(1+pop_i)/max_j log(1+pop_j)
          </div>
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр γ(u), который зависит от длины истории пользователя.
          </p>
        </div>
      </section>

    </main>
  );
}
