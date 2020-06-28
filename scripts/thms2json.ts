// deno run --allow-read scripts/thms2json.ts beeson/Theorems.txt > json/raw_thms.json
import { convertFormula } from './functions/convertFormula.ts';
import { RawTheorem } from './types/RawTheorem.ts';

const inputThmsFile = Deno.args[0];

const thmText = await Deno.readTextFile(inputThmsFile);

const thmLines = thmText.trimEnd().split('\n');

const thms: RawTheorem[] = [];
for (const line of thmLines) {
  const [kind, name, formula, proofRef] = line.split('\t');
  thms.push({
    kind,
    name,
    formula: convertFormula(formula),
    ...(proofRef ? { proofRef } : {})
  });
}

console.log(JSON.stringify(thms, null, 2));
