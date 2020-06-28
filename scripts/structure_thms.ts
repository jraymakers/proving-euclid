// deno run --allow-read scripts/structure_thms.ts json/raw_thms.json > json/structured_thms.json
import { createTheorem } from './functions/FormulaParsers.ts';
import { RawTheoremList } from './types/RawTheorem.ts';
import { Theorem } from './types/Theorem.ts';

const inputThmsFile = Deno.args[0];
const thmsJson = await Deno.readTextFile(inputThmsFile);
const thms: RawTheoremList = JSON.parse(thmsJson);

const outputThms: Theorem[] = [];

for (const thm of thms) {
  const theorem = createTheorem(thm.kind as Theorem['prefix'], thm.name, thm.formula, thm.proofRef || null);
  outputThms.push(theorem);
}

console.log(JSON.stringify(outputThms, null, 2));
