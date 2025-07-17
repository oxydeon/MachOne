/* eslint-disable @typescript-eslint/no-explicit-any */

export function isValidInteger(value: any): boolean {
  return Number.isInteger(value);
}

// allow string value that can be parsed as integer
export function isValidParsedInteger(value: any): boolean {
  // reject decimal
  if (typeof value === 'number' && value % 1 !== 0) return false;

  // reject decimal store as string
  if (typeof value === 'string' && value.includes('.')) return false;

  const valueParsed = Number.parseInt(value, 10);
  return isValidInteger(valueParsed);
}
