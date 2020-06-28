import { Formula, PredicateFormula, Term } from './Formula.ts';

export type Definition = Readonly<{
  prefix: 'defn';
  name: string;
  predicateFormula: PredicateFormula;
  equivalentFormula: Formula;
  existential: readonly Term[] | null;
}>;
