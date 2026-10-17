const rows = [
  { model: 'MF-SVD', hr: '0.234', ndcg: '0.0425', latency: '—' },
  { model: 'EASE', hr: '0.210', ndcg: '0.0404', latency: '—' },
  { model: 'DropoutNet', hr: '0.110', ndcg: '0.0218', latency: '—' },
  { model: 'SCIR', hr: '0.548', ndcg: '0.1243', latency: '1.8 мс', highlight: true },
];

export default function ResultsTable() {
  return (
    <section className="py-12 mb-20">
      <h2 className="text-3xl font-bold mb-6 font-montserrat border-l-4 border-scir-emerald pl-4">Результаты</h2>
      <div className="overflow-x-auto rounded-xl shadow-2xl table-white">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="p-4 font-bold font-montserrat">Модель</th>
              <th className="p-4 font-bold font-montserrat">HR@10</th>
              <th className="p-4 font-bold font-montserrat">nDCG@10</th>
              <th className="p-4 font-bold font-montserrat">Задержка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.model} className={r.highlight ? 'highlight-row' : 'hover:bg-gray-50'}>
                <td className="p-4 font-inter">{r.model}</td>
                <td className="p-4 font-inter">{r.hr}</td>
                <td className="p-4 font-inter">{r.ndcg}</td>
                <td className="p-4 font-inter">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4 font-inter">5 зёрен, N = 500. Значимость: p &lt; 10⁻¹⁵ (тест Уилкоксона).</p>
    </section>
  );
}
