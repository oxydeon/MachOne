/* eslint-disable no-restricted-syntax */
export const isNotNullish = <T>(val: T | undefined | null): val is T => val !== null && val !== undefined;

export const isNullish = <T>(val: T | undefined | null): val is undefined | null => val === null || val === undefined;
