import { ProofStep } from './ProofStep';

export type Proof = readonly ProofStep[];

export type ProofMap = Readonly<{
  [proofName: string]: Proof | undefined;
}>;
