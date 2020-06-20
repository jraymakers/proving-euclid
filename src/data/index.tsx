import * as defsJson from './json/defs.json';
import * as proofsJson from './json/proofs.json';
import * as thmsJson from './json/thms.json';
import { ProofMap } from './types/Proof';
import { TheoremList } from './types/Theorem';

const defs = defsJson as TheoremList;

const thms = thmsJson as TheoremList;

const proofs = proofsJson as ProofMap;

export { defs, thms, proofs };
