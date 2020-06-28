// deno run --allow-read scripts/defs2json.ts beeson/Definitions.txt > json/raw_defs.json
import { convertFormula } from './functions/convertFormula.ts';
import { RawTheorem } from './types/RawTheorem.ts';

const inputDefsFile = Deno.args[0];

const defText = await Deno.readTextFile(inputDefsFile);

const defLines = defText.trimEnd().split('\n');

const defs: RawTheorem[] = [];
for (const line of defLines) {
  const [name, formula] = line.split('\t');
  defs.push({
    kind: 'defn',
    name,
    formula: convertFormula(formula),
  });
}

console.log(JSON.stringify(defs, null, 2));
