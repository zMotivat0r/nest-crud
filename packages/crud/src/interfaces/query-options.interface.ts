import {
  QueryFields,
  QuerySort,
} from '@nestjsx/crud-request/lib/types/request-query.types';

import { QueryFilterOption } from '../types';

export interface QueryOptions {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  filter?: QueryFilterOption;
  join?: JoinOptions;
  sort?: QuerySort[];
  limit?: number;
  maxLimit?: number;
  cache?: number | false;
  alwaysPaginate?: boolean;
  softDelete?: boolean;
}

export interface JoinOptions {
  [key: string]: JoinOption;
}

export interface JoinOption {
  alias?: string;
  allow?: QueryFields;
  eager?: boolean;
  exclude?: QueryFields;
  persist?: QueryFields;
  select?: boolean;
  required?: boolean;
}
