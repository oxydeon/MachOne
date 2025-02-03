export type Query = { [key: string]: string | number | boolean | (string | number | boolean)[] };

export type Body = { [key: string]: unknown } | unknown[];
