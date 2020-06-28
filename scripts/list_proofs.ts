// deno run --allow-read scripts/list_proofs.ts beeson/proofs
import { walk } from 'https://deno.land/std/fs/walk.ts';

const proofsDir = Deno.args[0];

let numProofs = 0;
for await (const entry of walk(proofsDir, { exts: ['.prf'] })) {
  console.log(entry.path);
  numProofs++;
}
console.log(numProofs);
