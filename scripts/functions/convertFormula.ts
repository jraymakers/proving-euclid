export function convertFormula(formula: string): string {
  return formula.slice(1, formula.length - 1).replace(/\/\\/g, '&').replace(/\\\//g, '|');
}
