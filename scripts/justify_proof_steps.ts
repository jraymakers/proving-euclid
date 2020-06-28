// deno run --allow-read scripts/justify_proof_steps.ts json/raw_proofs.json > json/justified_proofs.json
import { MutableRawProofMap, RawProofMap } from './types/RawProof.ts';
import { RawProofStep } from './types/RawProofStep.ts';

const inputProofsFile = Deno.args[0];
const proofsJson = await Deno.readTextFile(inputProofsFile);
const proofs: RawProofMap = JSON.parse(proofsJson);

const outputProofs: MutableRawProofMap = {};
for (const proofName in proofs) {
  const proof = proofs[proofName];
  if (!proof) continue;
  const outputProof: RawProofStep[] = [];
  for (const proofStep of proof) {
    if (proofStep.kind === 'unjustified') {
    }
    outputProof.push(proofStep);
  }
  outputProofs[proofName] = proof;
}

console.log(JSON.stringify(outputProofs, null, 2));
