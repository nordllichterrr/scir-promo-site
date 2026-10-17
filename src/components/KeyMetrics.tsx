const metrics = [
  { value: '0.548', label: 'HR@10 на MovieLens-25M' }, { value: '0.1243', label: 'nDCG@10 на MovieLens-25M' },
  { value: '1.8 мс', label: 'Задержка на CPU' }, { value: '3400×', label: 'Быстрее кросс-энкодера' },
];
export default function KeyMetrics() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Цифры проекта</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass rounded-xl p-6 border-l-4 border-scir-emerald shadow-lg">
            <div className="text-3xl font-bold text-white mb-2">{m.value}</div>
            <div className="text-sm text-gray-300">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
