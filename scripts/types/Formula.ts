export type PredicateSymbol = string;
export type Term = string;

export type ConjunctionFormula = Readonly<{
  kind: 'conjunction';
  formulas: readonly Formula[];
}>;

export type DisjunctionFormula = Readonly<{
  kind: 'disjunction';
  formulas: readonly Formula[];
}>;

export type NegationFormula = Readonly<{
  kind: 'negation';
  formula: Formula;
}>;

export type PredicateFormula = Readonly<{
  kind: 'predicate';
  symbol: PredicateSymbol;
  terms: readonly Term[];
}>;

export type Formula
  = ConjunctionFormula
  | DisjunctionFormula
  | NegationFormula
  | PredicateFormula
  ;
