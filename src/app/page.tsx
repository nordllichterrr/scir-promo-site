import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
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
      <p className="text-xl md:text-2xl text-gray-700 max-w-3xl font-medium leading-relaxed mb-10">
        Индуктивный алгоритм рекомендаций для холодного старта. <br className="hidden md:block"/>
        Мы возвращаем системам способность работать там, где истории ещё нет.
      </p>
      <Link href="/algorithm" className="bg-scir-indigo text-white px-10 py-4 rounded-full font-black text-xl hover:bg-scir-amethyst hover:scale-105 transition-all shadow-lg">
        Перейти к алгоритму →
      </Link>
    </main>
  );
}
