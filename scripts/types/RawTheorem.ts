export type RawTheorem = Readonly<{
  kind: string;
  name: string;
  formula: string;
  proofRef?: string;
}>;

export type RawTheoremList = readonly RawTheorem[];
