import { Formula } from './Formula.ts';

export type Justification = Readonly<{
  prefix: string;
  name: string;
  inputs: readonly number[];// indexes of prior proof steps
}>;

export type KnownStructuredProofStep = Readonly<{
  kind: 'known';
  formula: Formula;
}>;
  
export type JustifiedStructuredProofStep = Readonly<{
  kind: 'justified';
  formula: Formula;
  justification: Justification | null;
}>;

export type ContradictionSubproofStructuredProofStep = Readonly<{
  kind: 'contradiction_subproof';
  assumption: Formula;
  conclusion: Formula; // should be negation of assumption
  subproof: readonly StructuredProofStep[];
}>;

export type CasesSubproofStructuredProofStep = Readonly<{
  kind: 'cases_subproof';
  targetFormula: Formula;
  casesFormulas: readonly Formula[];
  cases: readonly CaseSubproofStructuredProofStep[];
}>;

export type CaseSubproofStructuredProofStep = Readonly<{
  kind: 'case_subproof';
  targetFormula: Formula;
  caseFormula: Formula;
  subproof: readonly StructuredProofStep[];
}>;

export type CommentStructuredProofStep = Readonly<{
  kind: 'comment';
  text: string;
}>;

export type StructuredProofStep
  = KnownStructuredProofStep
  | JustifiedStructuredProofStep
  | ContradictionSubproofStructuredProofStep
  | CasesSubproofStructuredProofStep
  | CommentStructuredProofStep
  ;
