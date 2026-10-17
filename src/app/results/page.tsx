export default function ResultsPage() {
  const rows = [
    { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
    { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
    { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
    { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
  ];

  return (
    <main className="min-h-screen py-16 px-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-black mb-12 border-l-8 border-scir-emerald pl-6 text-white">Результаты алгоритма</h1>
      
      <div className="overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-white border-4 border-white/30">
        <table className="w-full text-xl md:text-2xl text-left border-collapse text-black">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-8 py-6 font-black uppercase tracking-wider">Модель</th>
              <th className="px-8 py-6 font-black uppercase tracking-wider">HR@10</th>
              <th className="px-8 py-6 font-black uppercase tracking-wider">nDCG@10</th>
              <th className="px-8 py-6 font-black uppercase tracking-wider">Задержка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.model} className={r.highlight ? 'bg-emerald-100 font-black' : 'hover:bg-gray-50 transition-colors'}>
                <td className="px-8 py-7">{r.model}</td>
                <td className="px-8 py-7">{r.hr}</td>
                <td className="px-8 py-7">{r.ndcg}</td>
                <td className="px-8 py-7">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-lg text-gray-400 mt-8 font-inter text-center">5 зёрен, N = 500. Значимость: p &lt; 10⁻¹⁵ (тест Уилкоксона).</p>
    </main>
  );
}
