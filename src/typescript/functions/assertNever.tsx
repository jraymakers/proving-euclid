export function assertNever(value: never): void {
  console.warn(`assertNever called: ${value}`);
}
