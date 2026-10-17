const audiences = [
  { num: '01', label: 'Исследователи ML' }, { num: '02', label: 'Инженеры продакшена' },
  { num: '03', label: 'Продуктовые аналитики' }, { num: '04', label: 'Корпоративные клиенты' },
];
export default function AudienceSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Для кого этот проект</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {audiences.map((a) => (
          <div key={a.num} className="glass rounded-xl p-6 border-l-4 border-scir-pink shadow-lg">
            <div className="text-3xl font-bold text-white mb-2">{a.num}</div>
            <div className="text-sm text-gray-300">{a.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
