import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-6 text-center bg-[#0F1225]">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <img 
          src="/logo.jpg" 
          alt="SCIR Logo" 
          className="w-[80%] md:w-[50%] max-w-2xl h-auto object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.5)] mb-10 rounded-xl" 
        />
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight">
          Добро пожаловать в <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-scir-emerald to-scir-amethyst">
            SCIR
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-medium leading-relaxed mb-10">
          Индуктивный алгоритм рекомендаций для холодного старта. <br className="hidden md:block"/>
          Мы возвращаем системам способность работать там, где истории ещё нет.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/algorithm" className="bg-scir-emerald text-[#0F1225] px-8 py-3 rounded-lg font-bold text-lg hover:bg-emerald-400 transition shadow-lg">
            Перейти к алгоритму
          </Link>
          <Link href="/contact" className="border-2 border-scir-amethyst text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-scir-amethyst transition shadow-lg">
            Оставить заявку
          </Link>
        </div>
      </div>
    </main>
  );
}
