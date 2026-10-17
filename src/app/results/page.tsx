export default function ResultsPage() {
  const rows = [
    { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
    { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
    { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
    { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
  ];

  return (
    <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-10 border-l-8 border-scir-emerald pl-6 text-[#1B1F3B]">Результаты алгоритма</h1>
      
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
      <p className="text-sm text-gray-500 mt-6 font-inter">5 зёрен, N = 500. Значимость: p &lt; 10⁻¹⁵ (тест Уилкоксона).</p>
    </main>
  );
}
