// deno run --allow-read scripts/structure_defs.ts json/raw_defs.json > json/structured_defs.json
import { createDefinition } from './functions/FormulaParsers.ts';
import { Definition } from './types/Definition.ts';
import { RawTheoremList } from './types/RawTheorem.ts';

const inputDefsFile = Deno.args[0];
const defsJson = await Deno.readTextFile(inputDefsFile);
const defs: RawTheoremList = JSON.parse(defsJson);

const outputDefs: Definition[] = [];

for (const def of defs) {
  const definition = createDefinition(def.name, def.formula);
  outputDefs.push(definition);
}

console.log(JSON.stringify(outputDefs, null, 2));
