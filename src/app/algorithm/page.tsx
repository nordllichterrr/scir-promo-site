import Formula from '@/components/Formula';

export default function AlgorithmPage() {
  return (
    <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-10 border-l-8 border-scir-amethyst pl-6 text-white">Как работает алгоритм</h1>
      
      <div className="card-glass p-8 rounded-3xl shadow-2xl mb-10 flex justify-center overflow-x-auto">
        <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
      </div>

      <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
        <p>
          <strong className="font-extrabold text-white">SCIR</strong> объединяет два сигнала: смысловой (эмбеддинги Sentence-BERT) и статистический (популярность товаров по закону Ципфа). Баланс между ними настраивается автоматически через параметр <span className="text-scir-pink font-bold"><Formula latex={String.raw`\gamma(u)`} /></span>.
        </p>
        <p>Параметр гейтинга вычисляется как:</p>
        <div className="card-glass p-6 rounded-2xl inline-block shadow-lg">
          <Formula block latex={String.raw`\gamma(u) = \frac{\gamma_{\text{base}}}{1 + 0.05 \cdot \min(|H_u|, 20)}`} />
        </div>
        <p>
          где <Formula latex={String.raw`\gamma_{\text{base}} = 0.45`} />, а <Formula latex={String.raw`|H_u|`} /> — длина истории взаимодействий пользователя.
        </p>
      </div>
    </main>
  );
}
