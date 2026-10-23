'use client';
import { useState } from 'react';
import B2BForm from '@/components/B2BForm';

export default function HomePage() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setOpenCard(openCard === index ? null : index);
  };

  const steps = [
    {
      phase: '01 · Диагностика',
      title: 'Постановка задачи и гипотезы',
      desc: 'User cold-start в movie recommendation: дано профиль без истории, вернуть K = 10 фильмов. Четыре гипотезы — H1 retrieval coverage, H2 exposure bias, H3 score calibration, H4 pool size.',
      metrics: [
        { val: '500', label: 'пользователей' },
        { val: '3', label: 'random seed' },
        { val: '49 157', label: 'фильмов в каталоге' },
        { val: 'HR@10', label: 'главная метрика' },
      ],
      details: [
        'Датасет: Serendipity-2018, 49 157 фильмов, 104 661 пользователь, 500 cold-start в тесте.',
        'Pipeline: all-MiniLM-L6-v2 (384d) → FAISS Flat → cross-encoder/ms-marco-MiniLM-L-6-v2.',
        'Baselines: Random, Popularity, Embedding Cosine, Candidates Only, Ours (CE Rerank).',
        'Железо: CPU-only Intel Xeon E5-2650 v4, без GPU — чтобы отразить resource-constrained деплой.',
      ],
      color: '#5b8cff',
    },
    {
      phase: '02 · Провал',
      title: 'Cross-encoder коллапсирует: 33.5× разрыв',
      desc: 'Sophisticated reranker проигрывает простой популярности в 33.5 раза. Retrieval coverage — 10.9% против 60.9%. Reranker не улучшает даже неотранжированных кандидатов.',
      metrics: [
        { val: '0.109', label: 'Recall@200 (FAISS)', bad: true },
        { val: '0.609', label: 'Recall@200 (baseline)', good: true },
        { val: '3', label: 'уникальных top-1' },
        { val: '−0.593', label: "Cohen's d" },
      ],
      details: [
        'HR@10: Popularity 0.268 ± 0.018 vs Ours 0.008 ± 0.005 (p < 10⁻⁹⁹).',
        'Recall@200: 0.109 (FAISS) vs 0.609 (baseline) — 5.6× разрыв, r = 0.89 с HR@10.',
        'Exposure: 3 уникальных top-1 на 500 пользователей; один фильм (175353) у 49%.',
        "Score calibration: mean diff 0.079, Cohen's d = 0.11, Spearman r = 0.004.",
        'Median GT position: 6717 — далеко за пределами cutoffs K = 200–1000.',
      ],
      color: '#ff5b6e',
    },
    {
      phase: '03 · Инсайт',
      title: 'Три compounding failure modes',
      desc: 'Провал не в «слабой модели», а в трёх слоях пайплайна: retrieval coverage → score discrimination → exposure bias. Reranker не виноват — виноват pipeline.',
      metrics: [
        { val: '1°', label: 'Retrieval bottleneck' },
        { val: '2°', label: 'Score collapse' },
        { val: '3°', label: 'Exposure concentration' },
        { val: '6717', label: 'median GT position' },
      ],
      details: [
        'Root cause 1: Sentence-BERT оптимизирован под semantic similarity, не под preference prediction — domain mismatch.',
        'Root cause 2: MS-MARCO cross-encoder переносится out-of-domain — web passages ≠ movie metadata.',
        'Root cause 3: metadata length bias — предметы с 10+ тегами систематически получают выше score.',
        'Error taxonomy: 38% genre over-weighting, 26% metadata length, 22% popularity artifacts, 14% шум.',
      ],
      color: '#ffb020',
    },
    {
      phase: '04 · Гипотеза',
      title: 'Что если объединить семантику и популярность?',
      desc: 'Два провала симметричны: pure content → semantic trap (obscure noise), pure popularity → popularity trap (no personalization). Байесовский компромисс: vMF × Zipf.',
      metrics: [
        { val: 'vMF', label: 'semantic likelihood' },
        { val: 'Zipf', label: 'popularity prior' },
        { val: 'γ(u)', label: 'adaptive gate' },
        { val: '0.45', label: 'γ_base' },
      ],
      details: [
        'Bayes: P(y=1 | u,i) ∝ P(u | i) · P(i).',
        'vMF: P(u | i) = C_d(κ) · exp(κ · ⟨u, e_i⟩).',
        'Zipf: P(i) ∝ (1 + pop_i)^α.',
        'Гейт: γ(u) = γ_base / (1 + 0.05 · min(|H_u|, 20)), γ_base = 0.45.',
        'Итоговый score: s(u,i) = (1−γ)·⟨u,e_i⟩ + γ·log(1+pop_i)/max log(1+pop_j).',
      ],
      color: '#8b5bff',
    },
    {
      phase: '05 · Метод',
      title: 'SCIR — Semantic-Collaborative Inductive Gating',
      desc: 'Closed-form, training-free, inductive. Recency-weighted семантический центроид + логарифмический popularity prior + user-adaptive gate. Миллисекунды на CPU, без retraining.',
      metrics: [
        { val: '1.8 ms', label: 'latency / user (CPU)', good: true },
        { val: '384d', label: 'SBERT fidelity' },
        { val: '0', label: 'итераций обучения' },
        { val: '50k', label: 'каталог, full-catalog' },
      ],
      details: [
        'Centroid: u = Σ w_i e_i / ‖Σ w_i e_i‖, w_i = 1 + 0.5 · pos(i)/|H_u| (recency).',
        'Cold user: u = Encoder(q_text)/‖Encoder(q_text)‖ — onboarding profile.',
        'Gate: γ(u) = 0.45 для strict cold; падает с ростом |H_u|.',
        'Anti-collapse blend: s_blend = β·s_RRF + (1−β)·s_CE, fallback при std(s_CE) ≤ 1e−5.',
        'Full-catalog ranking: |I| ≈ 50k–62k, без FAISS-префильтра.',
      ],
      color: '#00d1b2',
    },
    {
      phase: '06 · Валидация',
      title: 'SCIR обгоняет baselines в 2–3×',
      desc: 'Full-catalog, 5 seeds, N = 500 на MovieLens-25M и Serendipity-2018. HR@10 = 0.524–0.548, nDCG@10 = 0.124–0.160 — при p < 10⁻¹⁵ против EASE, MF-SVD, DropoutNet.',
      metrics: [
        { val: '0.548', label: 'HR@10 · ML-25M', good: true },
        { val: '0.524', label: 'HR@10 · Serendipity', good: true },
        { val: '0.800', label: 'HR@10 · S_both', good: true },
        { val: '0.745', label: 'Serendipity@10', good: true },
      ],
      details: [
        'MovieLens-25M: HR@10 = 0.5480 ± 0.0546, nDCG@10 = 0.1243; p = 4.10·10⁻²⁵ vs MF-SVD.',
        'Serendipity-2018: HR@10 = 0.5240 ± 0.0301, nDCG@10 = 0.1599; p = 8.98·10⁻¹⁶ vs MF-SVD.',
        'S_user / S_item / S_both: HR@10 = 0.625 / 0.525 / 0.800.',
        'Beyond-accuracy: CatCov = 0.0017, Gini = 0.669, Serendipity = 0.745 — все гейты пройдены.',
      ],
      color: '#3ddc84',
    },
    {
      phase: '07 · Ресурс',
      title: 'Open evaluation resource',
      desc: 'Чтобы результаты воспроизводились, вторая статья отдаёт не только метод, но и весь стенд: splits, embeddings, FAISS-индексы, metric suite, Docker/CI.',
      metrics: [
        { val: '70/10/20', label: 'temporal split' },
        { val: '110k+', label: 'item embeddings' },
        { val: '11', label: 'метрик' },
        { val: '9', label: 'baselines' },
      ],
      details: [
        'Splits: детерминированные 70/10/20 для MovieLens-25M и Serendipity-2018.',
        'Partitioning: S_user, S_item, S_both — формально раздельные.',
        'Artifacts: 384d SBERT embeddings, FAISS-индексы, master JSON конфиги.',
        'Harness: Random, Popularity, BM25, EmbCos, LightGCN, DropoutNet, ItemKNN, EASE, MF-SVD.',
        'Repro: Dockerfile, docker-compose, GitHub Actions CI, unified seeds.',
      ],
      color: '#ff8a3d',
    },
    {
      phase: '08 · Вывод',
      title: 'Провал стал методом',
      desc: 'Первая статья сказала «cross-encoder не работает в cold-start». Вторая ответила: «потому что pipeline misaligned — вот closed-form inductive fix, воспроизводимый стенд и multi-criteria гейты».',
      metrics: [
        { val: '68.5×', label: 'HR@10 uplift', good: true },
        { val: '5.6×', label: 'recall gap closed', good: true },
        { val: '4000×', label: 'latency vs CE', good: true },
        { val: '0', label: 'retraining', good: true },
      ],
      details: [
        'Paper 1: диагностический шаблон — coverage, exposure, calibration, pool-size ablations.',
        'Paper 2: методологический ответ — closed-form gating + evaluation resource.',
        'Сдвиг вклада: от «что сломано» к «как чинить + как воспроизводить».',
        'Практический вывод: инвестировать в retrieval, калибровку, гейты — не в размер модели.',
      ],
      color: '#ff5b8c',
    },
  ];

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden pb-20">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#16204a]/50 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto px-6 pt-16 relative z-10">
        
        {/* HERO HEADER */}
        <header id="hero" className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight text-white">
            От диагностики <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b8cff] via-[#00d1b2] to-[#3ddc84]">к SCIR</span>
          </h1>
          <p className="text-[#94a3c4] text-lg leading-relaxed mb-6">
            Как первая статья — <em>Diagnosing LLM-based Rerankers in Cold-Start Recommender Systems</em> — показала, что cross-encoder коллапсирует, и как вторая — <em>Cold-Start Recommendation: A Reproducible Multi-Criteria Evaluation Resource and Inductive Semantic-Collaborative Gating</em> — превратила этот провал в метод с HR@10 = 0.524–0.548 и латентностью 1.8 мс.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full border border-[#5b8cff]/30 bg-[#5b8cff]/10 text-[#c9d3ff] text-xs font-semibold uppercase tracking-wider">Paper 1 · 2604.16318v1</span>
            <span className="px-3 py-1 rounded-full border border-[#00d1b2]/30 bg-[#00d1b2]/10 text-[#9ff3e6] text-xs font-semibold uppercase tracking-wider">→ Paper 2 · SCIR</span>
            <span className="px-3 py-1 rounded-full border border-[#5b8cff]/30 bg-[#5b8cff]/10 text-[#c9d3ff] text-xs font-semibold uppercase tracking-wider">2 датасета · 5 seeds · N = 500</span>
          </div>
        </header>

        {/* TIMELINE */}
        <section id="timeline" className="relative border-l-2 border-[#26325a] pl-8 md:pl-12 space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div 
                className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full bg-[#070b16] border-4 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                style={{ borderColor: step.color, boxShadow: `0 0 15px ${step.color}` }}
              ></div>

              <div 
                className="glass-card"
                onClick={() => toggleCard(idx)}
                style={{ borderLeft: `4px solid ${step.color}` }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>{step.phase}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-[#94a3c4] text-sm leading-relaxed mb-4">{step.desc}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {step.metrics.map((m, i) => (
                    <div key={i} className="bg-white/5 border border-[#26325a] rounded-lg p-3">
                      <div className={`text-xl font-bold font-mono ${m.good ? 'text-[#3ddc84]' : m.bad ? 'text-[#ff5b6e]' : 'text-white'}`}>{m.val}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[#94a3c4]">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[#5b6a92] font-semibold uppercase tracking-wider">
                  {openCard === idx ? '▾ Скрыть детали' : '▸ Нажми, чтобы увидеть детали'}
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openCard === idx ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                  <ul className="list-disc pl-5 text-sm text-[#94a3c4] space-y-2">
                    {step.details.map((d, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: d }} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ФОРМА */}
        <section id="contact" className="mt-20 pt-10 border-t border-[#26325a]">
          <B2BForm />
        </section>
      </div>
    </main>
  );
}
