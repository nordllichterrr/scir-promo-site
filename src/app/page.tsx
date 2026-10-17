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
      
      {/* 1. БЛОК ПРИВЕТСТВИЯ */}
      <section id="hero" className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        {/* Большой логотип на главном экране */}
        <img 
          src="/logo.jpg" 
          alt="SCIR Logo" 
          className="w-[80%] md:w-[50%] max-w-2xl h-auto object-contain drop-shadow-md mb-8 rounded-xl" 
        />
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-[#1B1F3B] tracking-tight">
          Добро пожаловать в <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-scir-emerald to-scir-amethyst">
            SCIR
          </span>
        </h1>
        <p className="text-xl md:text-3xl text-gray-700 max-w-3xl font-medium leading-relaxed mb-10">
          Индуктивный алгоритм рекомендаций для холодного старта. <br className="hidden md:block"/>
          Мы возвращаем системам способность работать там, где истории ещё нет.
        </p>
        <a href="#algorithm" className="bg-scir-indigo text-white px-10 py-4 rounded-full font-black text-xl hover:bg-scir-amethyst hover:scale-105 transition-all shadow-lg">
          Узнать больше ↓
        </a>
      </section>

      {/* 2. АЛГОРИТМ И РЕЗУЛЬТАТЫ */}
      <section id="algorithm" className="py-20 px-6 max-w-5xl mx-auto w-full bg-white shadow-sm rounded-3xl my-10 border border-gray-100">
        <h2 className="text-4xl font-black mb-10 border-l-8 border-scir-amethyst pl-6 text-[#1B1F3B]">Как работает алгоритм</h2>
        
        <div className="bg-gray-50 p-8 rounded-3xl shadow-inner mb-8 flex justify-center overflow-x-auto border border-gray-200">
          <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
        </div>
        
        <p className="text-xl text-gray-700 leading-relaxed font-inter mb-16">
          SCIR объединяет смысловой сигнал (эмбеддинги Sentence-BERT) и статистический (популярность по закону Ципфа). Баланс настраивается автоматически через параметр <span className="text-scir-amethyst font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>.
        </p>

        <h2 className="text-4xl font-black mb-10 border-l-8 border-scir-emerald pl-6 text-[#1B1F3B]">Результаты</h2>
        
        <div className="overflow-hidden rounded-3xl shadow-lg border-2 border-gray-200">
          <table className="w-full text-lg md:text-xl text-left border-collapse text-black">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-8 py-5 font-black uppercase">Модель</th>
                <th className="px-8 py-5 font-black uppercase">HR@10</th>
                <th className="px-8 py-5 font-black uppercase">nDCG@10</th>
                <th className="px-8 py-5 font-black uppercase">Задержка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((r) => (
                <tr key={r.model} className={r.highlight ? 'bg-emerald-50 font-black text-emerald-900' : 'hover:bg-gray-50 transition-colors'}>
                  <td className="px-8 py-6">{r.model}</td>
                  <td className="px-8 py-6">{r.hr}</td>
                  <td className="px-8 py-6">{r.ndcg}</td>
                  <td className="px-8 py-6">{r.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. ФОРМА ЗАЯВКИ */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto w-full mb-10">
        <h2 className="text-4xl font-black mb-10 border-l-8 border-scir-pink pl-6 text-[#1B1F3B]">Оставить заявку</h2>
        <B2BForm />
      </section>

    </main>
  );
}
