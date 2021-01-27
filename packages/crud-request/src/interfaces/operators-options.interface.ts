export type CustomOperatorQuery = (field: string, param: string) => string;

export interface CustomOperators {
  [key: string]: { isArray?: boolean };
}
