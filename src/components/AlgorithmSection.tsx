import Formula from './Formula';
export default function AlgorithmSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="font-jura text-3xl font-bold mb-8 text-white">Как работает алгоритм</h2>
      <div className="glass text-white p-8 rounded-xl overflow-x-auto mb-8 shadow-lg flex justify-center">
        <Formula block latex={String.raw`s(u,i) = (1 - \gamma(u)) \cdot \langle u, e_i \rangle + \gamma(u) \cdot \frac{\log(1+\text{pop}_i)}{\max_{j \in I} \log(1+\text{pop}_j)}`} />
      </div>
    </section>
  );
}
