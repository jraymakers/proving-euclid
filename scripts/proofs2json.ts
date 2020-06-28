// deno run --allow-read scripts/proofs2json.ts beeson/proofs > json/raw_proofs.json
import { walk } from 'https://deno.land/std/fs/walk.ts';

import { MutableRawProofMap } from './types/RawProof.ts';
import { RawProofStep } from './types/RawProofStep.ts';

const proofsDir = Deno.args[0];

const proofMap: MutableRawProofMap = {};
for await (const entry of walk(proofsDir, { exts: ['.prf'] })) {
  const proofText = await Deno.readTextFile(entry.path);
  const proofLines = proofText.trimEnd().split('\n');
  const proofSteps: RawProofStep[] = [];
  for (const proofLine of proofLines) {
    const rawStepText = proofLine.trim();
    const commentStart = rawStepText.indexOf('%');
    const stepText = commentStart >= 0 ? rawStepText.slice(0, commentStart).trim() : rawStepText;
    const commentText = commentStart >=0 ? rawStepText.slice(commentStart) : null;
    if (stepText) {
      if (stepText.startsWith('cases')) {
        const [casesKeyword, rest] = stepText.split(/\s+/, 2);
        const [targetFormula, casesFormula] = rest.split(/\s*:\s*/);
        proofSteps.push({ kind: 'cases_start', targetFormula, casesFormula });
      } else if (stepText.startsWith('case')) {
        const [caseKeyword, rest] = stepText.split(/\s+/, 2);
        const [indexString, formula] = rest.split(/\s*:\s*/);
        proofSteps.push({ kind: 'case', index: parseInt(indexString, 10), formula: formula });
      } else if (stepText.startsWith('qedcase')) {
        proofSteps.push({ kind: 'qedcase' });
      } else if (stepText.endsWith('cases')) {
        const [formula, casesKeyword] = stepText.split(/\s+/);
        proofSteps.push({ kind: 'cases_end', formula });
      } else if (stepText.endsWith('assumption')) {
        const [formula, assumptionKeyword] = stepText.split(/\s+/);
        proofSteps.push({ kind: 'assumption', formula });
      } else if (stepText.endsWith('reductio')) {
        const [formula, reductioKeyword] = stepText.split(/\s+/);
        proofSteps.push({ kind: 'reductio', formula });
      } else {
        const [formula, justification] = stepText.split(/\s+/);
        if (justification) {
          proofSteps.push({ kind: 'justified', formula, justification });
        } else {
          if (proofSteps.length === 0 || proofSteps[proofSteps.length - 1].kind === 'known') {
            proofSteps.push({ kind: 'known', formula });
          } else {
            proofSteps.push({ kind: 'unjustified', formula });
          }
        }
      }    
    }
    if (commentText) {
      proofSteps.push({ kind: 'comment', text: commentText.slice(1).trim() });
    }
  }
  proofMap[entry.name] = proofSteps;
}

console.log(JSON.stringify(proofMap, null, 2));
