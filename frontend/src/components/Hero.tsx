import Image from 'next/image';
export default function Hero() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="mb-10 w-full max-w-2xl">
          <Image src="/logo.jpg" alt="SCIR Logo" width={800} height={450} className="w-full h-auto object-contain drop-shadow-2xl" priority />
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" rel="noopener noreferrer" className="bg-scir-emerald text-scir-bg px-8 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(46,196,166,0.4)]">
            Скачать репозиторий
          </a>
          <a href="#b2b" className="border-2 border-scir-amethyst text-white px-8 py-3 rounded-lg font-semibold hover:bg-scir-amethyst transition backdrop-blur-sm bg-white/5">
            Оставить заявку
          </a>
        </div>
      </div>
    </section>
  );
}
