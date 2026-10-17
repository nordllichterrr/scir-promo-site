import Formula from '@/components/Formula';

export default function AlgorithmPage() {
  const rows = [
    { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
    { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
    { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
    { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
  ];

  return (
    <main className="min-h-screen py-16 px-6 max-w-6xl mx-auto">
      
      {/* Блок алгоритма */}
      <h1 className="text-5xl font-black mb-10 border-l-8 border-scir-amethyst pl-6 text-white">Как работает алгоритм</h1>
      <div className="bg-[#1B1F3B]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-8 flex justify-center overflow-x-auto border border-white/10">
        <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
      </div>
      <p className="text-xl text-gray-200 leading-relaxed font-inter mb-20">
        SCIR объединяет смысловой сигнал (эмбеддинги Sentence-BERT) и статистический (популярность по закону Ципфа). Баланс настраивается автоматически через параметр <span className="text-scir-pink font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>.
      </p>

      {/* Блок результатов */}
      <h2 className="text-5xl font-black mb-10 border-l-8 border-scir-emerald pl-6 text-white">Результаты</h2>
      <div className="overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-white text-black border-4 border-white/30">
        <table className="w-full text-lg md:text-xl text-left border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-8 py-5 font-black uppercase">Модель</th>
              <th className="px-8 py-5 font-black uppercase">HR@10</th>
              <th className="px-8 py-5 font-black uppercase">nDCG@10</th>
              <th className="px-8 py-5 font-black uppercase">Задержка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.model} className={r.highlight ? 'bg-emerald-100 font-black' : 'hover:bg-gray-50 transition-colors'}>
                <td className="px-8 py-6">{r.model}</td>
                <td className="px-8 py-6">{r.hr}</td>
                <td className="px-8 py-6">{r.ndcg}</td>
                <td className="px-8 py-6">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
