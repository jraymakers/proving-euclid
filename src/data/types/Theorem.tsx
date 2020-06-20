export type Theorem = Readonly<{
  kind: string;
  name: string;
  formula: string;
  proofRef?: string;
}>;

export type TheoremList = readonly Theorem[];
