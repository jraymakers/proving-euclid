export type KnownRawProofStep = Readonly<{
  kind: 'known';
  formula: string;
}>;

export type JustifiedRawProofStep = Readonly<{
  kind: 'justified';
  formula: string;
  justification: string;
}>;

export type UnjustifiedRawProofStep = Readonly<{
  kind: 'unjustified';
  formula: string;
}>;

export type AssumptionRawProofStep = Readonly<{
  kind: 'assumption';
  formula: string;
}>;

export type ReductioRawProofStep = Readonly<{
  kind: 'reductio';
  formula: string;
}>;

export type CasesStartRawProofStep = Readonly<{
  kind: 'cases_start';
  targetFormula: string;
  casesFormula: string;
}>;

export type CaseRawProofStep = Readonly<{
  kind: 'case';
  index: number;
  formula: string;
}>;

export type QedcaseRawProofStep = Readonly<{
  kind: 'qedcase';
}>;

export type CasesEndRawProofStep = Readonly<{
  kind: 'cases_end';
  formula: string;
}>;

export type CommentRawProofStep = Readonly<{
  kind: 'comment';
  text: string;
}>;

export type RawProofStep
  = KnownRawProofStep
  | JustifiedRawProofStep
  | UnjustifiedRawProofStep
  | AssumptionRawProofStep
  | ReductioRawProofStep
  | CasesStartRawProofStep
  | CaseRawProofStep
  | QedcaseRawProofStep
  | CasesEndRawProofStep
  | CommentRawProofStep
  ;
