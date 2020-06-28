import { Definition } from '../types/Definition.ts';
import { Formula, NegationFormula, PredicateFormula } from '../types/Formula.ts';
import { Theorem } from '../types/Theorem.ts';

/*

Def -> Pred SP '<=>' SP MaybeExist

Thm -> Form (SP '==>' SP MaybeExist)?

MaybeExist -> ('?' VarList '.' SP)? Form

Form -> Disjunct | Conjunct

Disjunct -> Conjunct (SP '|' SP Conjunct)*

Conjunct -> SubForm (SP '&' SP SubForm)*

SubForm -> Neg | Paren | Pred

Neg -> '~' Paren

Paren -> '(' Form ')'

Pred -> [A-Za-z][A-Za-z] SP VarList

VarList -> Var (SP Var)*

Var -> [A-Za-z]

SP -> ' '

*/

type Def = {
  kind: 'Def';
  pred: Pred;
  maybeExist: MaybeExist;
};

type Thm = {
  kind: 'Thm';
  form: Form;
  maybeExist: MaybeExist | null;
};

type MaybeExist = {
  kind: 'MaybeExist';
  vars: string[] | null;
  form: Form;
};

type Form = Disjunct | FormNoDis;

type Disjunct = {
  kind: 'Disjunct';
  forms: FormNoDis[];
};

type FormNoDis = Conjunct | FormNoDisCon

type Conjunct = {
  kind: 'Conjunct';
  forms: FormNoDisCon[];
};

type FormNoDisCon = Neg | Paren | Pred;

type Neg = {
  kind: 'Neg';
  paren: Paren;
};

type Paren = {
  kind: 'Paren';
  form: Form;
};

type Pred = {
  kind: 'Pred';
  symbol: string;
  vars: string[];
};

type ParseState = {
  input: string;
  pos: number;
};

type AcceptedParseResult<T> = {
  success: true;
  state: ParseState;
  data: T;
};

type ErrorParseResult = {
  success: false;
  errorState: ParseState;
  errorMessage: string;
}

type ParseResult<T> = AcceptedParseResult<T> | ErrorParseResult;

function error(state: ParseState, message: string): ErrorParseResult {
  return {
    success: false,
    errorState: state,
    errorMessage: message,
  };
}

function acceptAnyChar(inputState: ParseState): ParseResult<string> {
  const { input, pos } = inputState;
  const c = input.charAt(pos);
  if (!c) return error(inputState, `char not found at pos ${pos}`);
  return { success: true, state: { input, pos: pos + 1 }, data: c };
}

function acceptChars(inputState: ParseState, numChars: number): ParseResult<string> {
  const { input, pos } = inputState;
  let s = '';
  for (let i = 0; i < numChars; i++) {
    s += input.charAt(pos + i);
  }
  return { success: true, state: { input, pos: pos + numChars }, data: s };
}

function acceptMatchingChar(inputState: ParseState, regex: RegExp): ParseResult<string> {
  const charResult = acceptAnyChar(inputState);
  if (!charResult.success) return charResult;
  if (!regex.test(charResult.data)) return error(charResult.state, `char ${charResult.data} does not match ${regex}`);
  return charResult;
}

function acceptMatchingString(inputState: ParseState, s: string): ParseResult<string> {
  const charsResult = acceptChars(inputState, s.length);
  if (!charsResult.success) return charsResult;
  if (s !== charsResult.data) return error(charsResult.state, `"${charsResult.data}" does not match "${s}"`);
  return charsResult;
}

function acceptSpace(inputState: ParseState): ParseResult<string> {
  const spaceResult = acceptMatchingChar(inputState, / /);
  if (!spaceResult.success) return spaceResult;
  return spaceResult;
}

function acceptVar(inputState: ParseState): ParseResult<string> {
  const varResult = acceptMatchingChar(inputState, /[A-Za-z]/);
  if (!varResult.success) return varResult;
  return varResult;
}

function acceptVarList(inputState: ParseState): ParseResult<string[]> {
  let varResult = acceptVar(inputState);
  if (!varResult.success) return varResult;

  const vars: string[] = [];
  let optionalVarResult: ParseResult<string> = varResult;
  while (optionalVarResult.success) {
    varResult = optionalVarResult;
    vars.push(varResult.data);

    const spaceResult = acceptSpace(varResult.state);
    if (!spaceResult.success) break;

    optionalVarResult = acceptVar(spaceResult.state);
  }

  return { success: true, state: varResult.state, data: vars };
}

function acceptSymbolChar(inputState: ParseState): ParseResult<string> {
  const charResult = acceptMatchingChar(inputState, /[A-Z]/);
  if (!charResult.success) return charResult;
  return charResult;
}

function acceptPred(inputState: ParseState): ParseResult<Pred> {
  const char1Result = acceptSymbolChar(inputState);
  if (!char1Result.success) return char1Result;
  const char2Result = acceptSymbolChar(char1Result.state);
  if (!char2Result.success) return char2Result;
  const spaceResult = acceptSpace(char2Result.state);
  if (!spaceResult.success) return spaceResult;
  const varListResult = acceptVarList(spaceResult.state);
  if (!varListResult.success) return varListResult;

  const symbol = char1Result.data + char2Result.data;
  const vars = varListResult.data;

  return { success: true, state: varListResult.state, data: { kind: 'Pred', symbol, vars } };
}

function acceptParen(inputState: ParseState): ParseResult<Paren> {
  const openParenResult = acceptMatchingChar(inputState, /\(/);
  if (!openParenResult.success) return openParenResult;
  const formResult = acceptForm(openParenResult.state);
  if (!formResult.success) return formResult;
  const closeParenResult = acceptMatchingChar(formResult.state, /\)/);
  if (!closeParenResult.success) return closeParenResult;
  return { success: true, state: closeParenResult.state, data: { kind: 'Paren', form: formResult.data } };
}

function acceptNeg(inputState: ParseState): ParseResult<Neg> {
  const tildeResult = acceptMatchingChar(inputState, /\~/);
  if (!tildeResult.success) return tildeResult;
  const parenResult = acceptParen(tildeResult.state);
  if (!parenResult.success) return parenResult;
  return { success: true, state: parenResult.state, data: { kind: 'Neg', paren: parenResult.data } };
}

function acceptFormNoDisCon(inputState: ParseState): ParseResult<FormNoDisCon> {
  const negResult = acceptNeg(inputState);
  if (negResult.success) return negResult;
  const parenResult = acceptParen(inputState);
  if (parenResult.success) return parenResult;
  const predResult = acceptPred(inputState);
  if (predResult.success) return predResult;
  return error(inputState, `not neg, paren, or pred`);
}

function acceptConjunct(inputState: ParseState): ParseResult<Conjunct> {
  let formResult = acceptFormNoDisCon(inputState);
  if (!formResult.success) return formResult;

  const forms: FormNoDisCon[] = [];
  let optionalFormResult: ParseResult<FormNoDisCon> = formResult;
  while (optionalFormResult.success) {
    formResult = optionalFormResult;
    forms.push(formResult.data);

    const space1Result = acceptSpace(formResult.state);
    if (!space1Result.success) break;
    const ampResult = acceptMatchingChar(space1Result.state, /\&/);
    if (!ampResult.success) break;
    const space2Result = acceptSpace(ampResult.state);
    if (!space2Result.success) break;

    optionalFormResult = acceptFormNoDisCon(space2Result.state);
  }

  return { success: true, state: formResult.state, data: { kind: 'Conjunct', forms } };
}

function acceptFormNoDis(inputState: ParseState): ParseResult<FormNoDis> {
  const conjunctResult = acceptConjunct(inputState);
  if (conjunctResult.success) return conjunctResult;
  const formResult = acceptFormNoDisCon(inputState);
  if (formResult.success) return formResult;
  return error(inputState, `not conjunct, neg, paren, or pred`);
}

function acceptDisjunct(inputState: ParseState): ParseResult<Disjunct> {
  let formResult = acceptFormNoDis(inputState);
  if (!formResult.success) return formResult;

  const forms: FormNoDis[] = [];
  let optionalFormResult: ParseResult<FormNoDis> = formResult;
  while (optionalFormResult.success) {
    formResult = optionalFormResult;
    forms.push(formResult.data);

    const space1Result = acceptSpace(formResult.state);
    if (!space1Result.success) break;
    const pipeResult = acceptMatchingChar(space1Result.state, /\|/);
    if (!pipeResult.success) break;
    const space2Result = acceptSpace(pipeResult.state);
    if (!space2Result.success) break;

    optionalFormResult = acceptFormNoDis(space2Result.state);
  }

  return { success: true, state: formResult.state, data: { kind: 'Disjunct', forms } };
}

function acceptForm(inputState: ParseState): ParseResult<Form> {
  const disjunctResult = acceptDisjunct(inputState);
  if (disjunctResult.success) return disjunctResult;
  const formResult = acceptFormNoDis(inputState);
  if (formResult.success) return formResult;
  return error(inputState, `not disjunct, conjunct, neg, paren, or pred`);
}

function acceptExist(inputState: ParseState): ParseResult<string[]> {
  const questionResult = acceptMatchingChar(inputState, /\?/);
  if (!questionResult.success) return questionResult;
  const varListResult = acceptVarList(questionResult.state);
  if (!varListResult.success) return varListResult;
  const periodResult = acceptMatchingChar(varListResult.state, /\./);
  if (!periodResult.success) return periodResult;
  const spaceResult = acceptSpace(periodResult.state);
  if (!spaceResult.success) return spaceResult;

  return { success: true, state: spaceResult.state, data: varListResult.data };
}

function acceptMaybeExist(inputState: ParseState): ParseResult<MaybeExist> {
  const existResult = acceptExist(inputState);
  
  const formResult = acceptForm(existResult.success ? existResult.state : inputState);
  if (!formResult.success) return formResult;

  return {
    success: true,
    state: formResult.state,
    data: {
      kind: 'MaybeExist',
      vars: existResult.success ? existResult.data : null,
      form: formResult.data,
    },
  };
}

function acceptThm(inputState: ParseState): ParseResult<Thm> {
  const formResult = acceptForm(inputState);
  if (!formResult.success) return formResult;

  const space1Result = acceptSpace(formResult.state);
  if (space1Result.success) {
    const arrowResult = acceptMatchingString(space1Result.state, '==>');
    if (arrowResult.success) {
      const space2Result = acceptSpace(arrowResult.state);
      if (space2Result.success) {
        const maybeExistResult = acceptMaybeExist(space2Result.state);
        if (maybeExistResult.success) {
          return {
            success: true,
            state: maybeExistResult.state,
            data: {
              kind: 'Thm',
              form: formResult.data,
              maybeExist: maybeExistResult.data,
            }
          };
        }
      }
    }
  }

  return {
    success: true,
    state: formResult.state,
    data: {
      kind: 'Thm',
      form: formResult.data,
      maybeExist: null,
    },
  };
}

function acceptDef(inputState: ParseState): ParseResult<Def> {
  const predResult = acceptPred(inputState);
  if (!predResult.success) return predResult;
  const space1Result = acceptSpace(predResult.state);
  if (!space1Result.success) return space1Result;
  const arrowResult = acceptMatchingString(space1Result.state, '<=>');
  if (!arrowResult.success) return arrowResult;
  const space2Result = acceptSpace(arrowResult.state);
  if (!space2Result.success) return space2Result;
  const maybeExistResult = acceptMaybeExist(space2Result.state);
  if (!maybeExistResult.success) return maybeExistResult;
  return {
    success: true,
    state: maybeExistResult.state,
    data: {
      kind: 'Def',
      pred: predResult.data,
      maybeExist: maybeExistResult.data,
    },
  };
}

function formulaFromPred(pred: Pred): PredicateFormula {
  return {
    kind: 'predicate',
    symbol: pred.symbol,
    terms: pred.vars,
  }
}

function formulaFromParen(paren: Paren): Formula {
  return formulaFromForm(paren.form);
}

function formulaFromNeg(neg: Neg): NegationFormula {
  return {
    kind: 'negation',
    formula: formulaFromForm(neg.paren),
  }
}

function formulaFromConjunct(conjunct: Conjunct): Formula {
  if (conjunct.forms.length === 1) {
    return formulaFromForm(conjunct.forms[0]);
  } else {
    return {
      kind: 'conjunction',
      formulas: conjunct.forms.map(formulaFromForm),
    };
  }
}

function formulaFromDisjunct(disjunct: Disjunct): Formula {
  if (disjunct.forms.length === 1) {
    return formulaFromForm(disjunct.forms[0]);
  } else {
    return {
      kind: 'disjunction',
      formulas: disjunct.forms.map(formulaFromForm),
    };
  }
}

function formulaFromForm(form: Form): Formula {
  switch (form.kind) {
    case 'Disjunct':
      return formulaFromDisjunct(form);
    case 'Conjunct':
      return formulaFromConjunct(form);
    case 'Neg':
      return formulaFromNeg(form);
    case 'Paren':
      return formulaFromParen(form);
    case 'Pred':
      return formulaFromPred(form);
  }
}

export function createDefinition(name: string, defFormulaString: string): Definition {
  const defResult = acceptDef({ input: defFormulaString, pos: 0 });
  if (!defResult.success) {
    throw new Error('failed to parse def: ' + defResult.errorMessage
      + '\n' + 'pos = ' + defResult.errorState.pos
      + '\n' + defResult.errorState.input);
  }
  const def = defResult.data;

  const predicateFormula = formulaFromPred(def.pred);
  const equivalentFormula = formulaFromForm(def.maybeExist.form);
  const existential = def.maybeExist.vars || null;

  return {
    prefix: 'defn',
    name,
    predicateFormula,
    equivalentFormula,
    existential,
  };
}

export function createTheorem(
  prefix: Theorem['prefix'],
  name: string,
  thmFormulaString: string,
  proofRef: string | null,
): Theorem {
  const thmResult = acceptThm({ input: thmFormulaString, pos: 0 });
  if (!thmResult.success) {
    throw new Error('failed to parse thm: ' + thmResult.errorMessage
      + '\n' + 'pos = ' + thmResult.errorState.pos
      + '\n' + thmResult.errorState.input);
  }
  const thm = thmResult.data;

  if (thm.maybeExist) {
    const antecedent = formulaFromForm(thm.form);
    const consequent = formulaFromForm(thm.maybeExist.form);
    const existential = thm.maybeExist.vars;
    return {
      prefix,
      name,
      antecedent,
      consequent,
      existential,
      proofRef,
    };
  } else {
    const antecedent = null;
    const consequent = formulaFromForm(thm.form);
    const existential = null;
    return {
      prefix,
      name,
      antecedent,
      consequent,
      existential,
      proofRef,
    };
  }
}
