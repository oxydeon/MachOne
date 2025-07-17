/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */

export function isNullish(value: any | undefined): boolean {
  return [
    undefined,
    null,
  ].includes(value);
}
