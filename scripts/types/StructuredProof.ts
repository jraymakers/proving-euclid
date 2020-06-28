import { StructuredProofStep } from './StructuredProofStep.ts';

export type StructuredProof = readonly StructuredProofStep[];

export type MutableStructuredProofMap = {
  [proofName: string]: StructuredProof | undefined;
};
export type StructuredProofMap = Readonly<MutableStructuredProofMap>;
