import Formula from '@/components/Formula';

export default function AlgorithmPage() {
  return (
    <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-black mb-12 border-l-8 border-scir-amethyst pl-6 text-white">Как работает алгоритм</h1>
      
      <div className="bg-[#1B1F3B]/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl mb-12 flex justify-center overflow-x-auto border-2 border-white/20">
        <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
      </div>

      <div className="space-y-8 text-xl md:text-2xl font-light text-gray-100 leading-relaxed">
        <p>
          <strong className="font-bold text-white">SCIR</strong> объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр <span className="text-scir-pink font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>.
        </p>
        <p>Параметр гейтинга вычисляется как:</p>
        <div className="bg-[#1B1F3B]/90 p-8 rounded-2xl border border-white/20 inline-block shadow-lg text-white">
          <Formula block latex={String.raw`\gamma(u) = \frac{\gamma_{\text{base}}}{1 + 0.05 \cdot \min(|H_u|, 20)}`} />
        </div>
        <p>
          где <Formula latex={String.raw`\gamma_{\text{base}} = 0.45`} />, а <Formula latex={String.raw`|H_u|`} /> — длина истории взаимодействий пользователя.
        </p>
      </div>
    </main>
  );
}
