import Link from 'next/link';
import Formula from '@/components/Formula';
import ResultsTable from '@/components/ResultsTable';
import B2BForm from '@/components/B2BForm';

export default function HomePage() {
  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <Link href="/" className="inline-block mb-8 text-scir-emerald hover:text-white transition font-montserrat font-bold">
        ← Вернуться на главную
      </Link>
      <div className="flex justify-center mb-16">
        <img src="/logo.jpg" alt="SCIR" className="h-24 w-auto object-contain rounded-lg shadow-xl" />
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6 font-montserrat border-l-4 border-scir-amethyst pl-4">Как работает алгоритм</h2>
        <div className="bg-scir-indigo/80 backdrop-blur-md p-8 rounded-xl shadow-2xl mb-6 flex justify-center overflow-x-auto border border-white/10">
          <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
        </div>
        <p className="leading-relaxed font-inter text-lg">
          SCIR объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс настраивается автоматически через параметр <span className="text-scir-pink font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>, который зависит от длины истории пользователя.
        </p>
      </section>

      <ResultsTable />
      <B2BForm />
    </main>
  );
}
