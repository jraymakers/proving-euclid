import { RawProofStep } from './RawProofStep.ts';

export type RawProof = readonly RawProofStep[];

export type MutableRawProofMap = {
  [proofName: string]: RawProof | undefined;
};
export type RawProofMap = Readonly<MutableRawProofMap>;
