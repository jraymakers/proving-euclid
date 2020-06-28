// deno run --allow-read scripts/structure_proofs.ts json/raw_proofs.json > json/structured_proofs.json
import { Formula } from './types/Formula.ts';
import { RawProofMap } from './types/RawProof.ts';
import { MutableStructuredProofMap } from './types/StructuredProof.ts';
import {
  CaseSubproofStructuredProofStep,
  StructuredProofStep,
} from './types/StructuredProofStep.ts';

type BaseStackItem = {
  stepList: StructuredProofStep[];
};

type RootStackItem = BaseStackItem & {
  kind: 'root';
}

type ContradictionSubproofStackItem = BaseStackItem & {
  kind: 'contradiction';
  assumption: Formula;
}

type CasesSubproofStackItem = {
  kind: 'cases';
  targetFormula: Formula;
  casesFormulas: readonly Formula[];
  cases: CaseSubproofStructuredProofStep[];
}

type CaseSubproofStackItem = BaseStackItem & {
  kind: 'case';
  caseFormula: Formula;
}

type StackItem
  = RootStackItem
  | ContradictionSubproofStackItem
  | CasesSubproofStackItem
  | CaseSubproofStackItem
  ;

function parseFormula(formula: string): Formula {
  const symbol = formula.slice(0, 2);
  const rest = formula.slice(2);
  if (symbol === 'NO') {
    return {
      kind: 'negation',
      formula: parseFormula(rest),
    };
  } else if (symbol === 'AN') {
    return {
      kind: 'conjunction',
      formulas: rest.split('+').map(parseFormula),
    };
  } else if (symbol === 'OR') {
    return {
      kind: 'disjunction',
      formulas: rest.split('|').map(parseFormula),
    };
  } else {
    return {
      kind: 'predicate',
      symbol,
      terms: rest.split(''),
    };
  }
}

const inputProofsFile = Deno.args[0];
const proofsJson = await Deno.readTextFile(inputProofsFile);
const proofs: RawProofMap = JSON.parse(proofsJson);

const proofsToSkip: { [proofName: string]: true } = {
  '5-line.prf': true,
  'circle-radius.prf': true,
  'erectedperpendicularunique2.prf': true,
  'nullsegment3.prf': true,
  'sumofparts.prf': true,
}

const outputProofs: MutableStructuredProofMap = {};

for (const proofName in proofs) {

  try {

    if (proofsToSkip[proofName]) continue;

    const proof = proofs[proofName];
    if (!proof) continue;

    let knownPhase = true;
    const stack: StackItem[] = [{ kind: 'root', stepList: [] }];

    for (const proofStep of proof) {

      const stackItem = stack[stack.length - 1];
      if (!stackItem) {
        throw new Error('new proof step, but stack empty');
      }

      if (knownPhase) {
        if (proofStep.kind !== 'known') {
          knownPhase = false;
        }
      } else {
        if (proofStep.kind === 'known') {
          throw new Error('known after known phase');
        }
      }

      if (stackItem.kind === 'cases') {
        if (proofStep.kind === 'case') {
          stack.push({
            kind: 'case',
            caseFormula: parseFormula(proofStep.formula),
            stepList: [],
          });
          continue;
        } else if (proofStep.kind !== 'cases_end') {
          throw new Error('case or cases_end proof step expected');
        }
      }

      switch (proofStep.kind) {

        case 'known': 
          if (stackItem.kind === 'cases') {
            throw new Error('unexpected step in cases stack item');
          }
          stackItem.stepList.push({
            kind: 'known',
            formula: parseFormula(proofStep.formula),
          });
          break;

        case 'justified':
          {
            if (stackItem.kind === 'cases') {
              throw new Error('unexpected step in cases stack item');
            }
            const justificationParts = proofStep.justification.split(':');
            const prefix = justificationParts[0] || '';
            const name = justificationParts[1] || '';
            stackItem.stepList.push({
              kind: 'justified',
              formula: parseFormula(proofStep.formula),
              justification: {
                prefix: justificationParts[0],
                name: justificationParts[1],
                inputs: [], // todo: calculate inputs?
              },
            });
          }
          break;

        case 'unjustified':
          if (stackItem.kind === 'cases') {
            throw new Error('unexpected step in cases stack item');
          }
          stackItem.stepList.push({
            kind: 'justified',
            formula: parseFormula(proofStep.formula),
            justification: null,  // todo: calculate justification?
          });
          break;

        case 'assumption':
          stack.push({
            kind: 'contradiction',
            assumption: parseFormula(proofStep.formula),
            stepList: [],
          });
          break;

        case 'reductio':
          {
            if (stackItem.kind !== 'contradiction') {
              throw new Error('contradiction stack item expected');
            }
            stack.pop();
            const nextStackItem = stack[stack.length - 1];
            if (!nextStackItem) {
              throw new Error('end of contradiction subproof, but stack empty');
            }
            if (nextStackItem.kind === 'cases') {
              throw new Error('end of contradiction subproof, but stack has cases stack item');
            }
            nextStackItem.stepList.push({
              kind: 'contradiction_subproof',
              assumption: stackItem.assumption,
              conclusion: parseFormula(proofStep.formula),
              subproof: stackItem.stepList,
            });
          }
          break;

        case 'cases_start':
          stack.push({
            kind: 'cases',
            targetFormula: parseFormula(proofStep.targetFormula),
            casesFormulas: proofStep.casesFormula.split('|').map(parseFormula),
            cases: [],
          });
          break;

        case 'case':
          // case in cases is handled above
          throw new Error('case step not in cases step');

        case 'qedcase':
          {
            if (stackItem.kind !== 'case') {
              throw new Error('case stack item expected');
            }
            stack.pop();
            const nextStackItem = stack[stack.length - 1];
            if (!nextStackItem) {
              throw new Error('end of case subproof, but stack empty');
            }
            if (nextStackItem.kind !== 'cases') {
              throw new Error('expected cases stack item');
            }
            nextStackItem.cases.push({
              kind: 'case_subproof',
              targetFormula: nextStackItem.targetFormula,
              caseFormula: stackItem.caseFormula,
              subproof: stackItem.stepList,
            });
          }
          break;

        case 'cases_end':
          {
            if (stackItem.kind !== 'cases') {
              throw new Error('cases stack item expected');
            }
            stack.pop();
            const nextStackItem = stack[stack.length - 1];
            if (!nextStackItem) {
              throw new Error('end of cases, but stack empty');
            }
            if (nextStackItem.kind === 'cases') {
              throw new Error('end of cases subproof, but stack has (another) cases stack item');
            }
            nextStackItem.stepList.push({
              kind: 'cases_subproof',
              targetFormula: stackItem.targetFormula,
              casesFormulas: stackItem.casesFormulas,
              cases: stackItem.cases,
            });
          }
          break;

        case 'comment':
          if (stackItem.kind === 'cases') {
            throw new Error('unexpected step in cases stack item');
          }
          stackItem.stepList.push({
            kind: 'comment',
            text: proofStep.text,
          });
          break;

      }
    }

    if (stack.length !== 1) {
      throw new Error(`end of proof, but stack length is ${stack.length}`);
    }
    const stackItem = stack[0];
    if (stackItem.kind !== 'root') {
      throw new Error('root stack item expected');
    }

    outputProofs[proofName] = stackItem.stepList;
  } catch (err) {
    outputProofs[proofName] = [{ kind: 'comment', text: 'ERROR: ' + err.toString() }];
  }
}

console.log(JSON.stringify(outputProofs, null, 2));
