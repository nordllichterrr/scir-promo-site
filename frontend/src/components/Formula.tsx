'use client';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export default function Formula({ latex, block = false }: { latex: string, block?: boolean }) {
  return block ? <BlockMath math={latex} /> : <InlineMath math={latex} />;
}
