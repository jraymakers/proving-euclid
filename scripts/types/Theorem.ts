import { Formula, Term } from './Formula.ts';

export type Theorem = Readonly<{
  prefix: 'cn' | 'axiom' | 'postulate' | 'lemma' | 'theorem';
  name: string;
  antecedent: Formula | null;
  consequent: Formula;
  existential: readonly Term[] | null;
  proofRef: string | null;
}>;
