export type KnownProofStep = {
  kind: 'known';
  term: string;
};

export type JustifiedProofStep = {
  kind: 'justified';
  term: string;
  justification: string;
};

export type UnjustifiedProofStep = {
  kind: 'unjustified';
  term: string;
};

export type AssumptionProofStep = {
  kind: 'assumption';
  term: string;
};

export type ReductioProofStep = {
  kind: 'reductio';
  term: string;
};

export type CasesStartProofStep = {
  kind: 'cases_start';
  targetTerm: string;
  casesTerm: string;
};

export type CaseProofStep = {
  kind: 'case';
  index: number;
  term: string;
};

export type QedcaseProofStep = {
  kind: 'qedcase';
};

export type CasesEndProofStep = {
  kind: 'cases_end';
  term: string;
};

export type CommentProofStep = {
  kind: 'comment';
  text: string;
};

export type ProofStep
  = KnownProofStep
  | JustifiedProofStep
  | UnjustifiedProofStep
  | AssumptionProofStep
  | ReductioProofStep
  | CasesStartProofStep
  | CaseProofStep
  | QedcaseProofStep
  | CasesEndProofStep
  | CommentProofStep
  ;
