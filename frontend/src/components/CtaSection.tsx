export default function CtaSection() {
  return (
    <section className="py-20 card-glass border-y border-white/10 text-center px-4">
      <h2 className="font-jura text-3xl font-bold text-white mb-4">Готовы попробовать SCIR?</h2>
      <p className="text-gray-300 mb-8">Оставьте заявку на пилот или скачайте репозиторий</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="#b2b" className="bg-scir-pink text-scir-bg px-8 py-3 rounded-lg font-semibold hover:bg-pink-300 transition shadow-[0_0_15px_rgba(240,166,202,0.4)]">Оставить заявку</a>
        <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="border-2 border-scir-emerald text-scir-emerald px-8 py-3 rounded-lg font-semibold hover:bg-scir-emerald hover:text-scir-bg transition">Скачать репозиторий</a>
      </div>
    </section>
  );
}
