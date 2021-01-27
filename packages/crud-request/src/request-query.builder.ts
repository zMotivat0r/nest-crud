import {
  hasValue,
  isArrayFull,
  isNil,
  isObject,
  isString,
  isUndefined,
} from '@nestjsx/util';
import { stringify } from 'qs';

import {
  CreateQueryParams,
  CustomOperators,
  RequestQueryBuilderOptions,
} from './interfaces';
import {
  validateCondition,
  validateFields,
  validateJoin,
  validateNumeric,
  validateSort,
} from './request-query.validator';
import {
  QueryFields,
  QueryFilter,
  QueryFilterArr,
  QueryJoin,
  QueryJoinArr,
  QuerySort,
  QuerySortArr,
  SCondition,
} from './types';

// tslint:disable:variable-name ban-types
export class RequestQueryBuilder {
  constructor() {
    this.setParamNames();
  }

  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      fields: ['fields', 'select'],
      search: 's',
      filter: 'filter',
      or: 'or',
      join: 'join',
      sort: 'sort',
      limit: ['limit', 'per_page'],
      offset: 'offset',
      page: 'page',
      cache: 'cache',
    },
  };
  private paramNames: {
    [key in keyof RequestQueryBuilderOptions['paramNamesMap']]: string;
  } = {};
  public queryObject: { [key: string]: any } = {};
  public queryString: string;

  static setOptions(options: RequestQueryBuilderOptions) {
    RequestQueryBuilder._options = {
      ...RequestQueryBuilder._options,
      ...options,
      paramNamesMap: {
        ...RequestQueryBuilder._options.paramNamesMap,
        ...(options.paramNamesMap ? options.paramNamesMap : {}),
      },
    };
  }

  static getOptions(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  static create(
    params?: CreateQueryParams,
    customOperators?: CustomOperators,
  ): RequestQueryBuilder {
    const qb = new RequestQueryBuilder();
    return isObject(params) ? qb.createFromParams(params, customOperators) : qb;
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  setParamNames() {
    Object.keys(RequestQueryBuilder._options.paramNamesMap).forEach((key) => {
      const name = RequestQueryBuilder._options.paramNamesMap[key];
      this.paramNames[key] = isString(name) ? (name as string) : (name[0] as string);
    });
  }

  query(encode = true): string {
    if (this.queryObject[this.paramNames.search]) {
      this.queryObject[this.paramNames.filter] = undefined;
      this.queryObject[this.paramNames.or] = undefined;
    }
    this.queryString = stringify(this.queryObject, { encode });
    return this.queryString;
  }

  select(fields: QueryFields): this {
    if (isArrayFull(fields)) {
      validateFields(fields);
      this.queryObject[this.paramNames.fields] = fields.join(this.options.delimStr);
    }
    return this;
  }

  search(s: SCondition) {
    if (!isNil(s) && isObject(s)) {
      this.queryObject[this.paramNames.search] = JSON.stringify(s);
    }
    return this;
  }

  setFilter(
    f: QueryFilter | QueryFilterArr | Array<QueryFilter | QueryFilterArr>,
    customOperators?: CustomOperators,
  ): this {
    this.setCondition(f, 'filter', customOperators);
    return this;
  }

  setOr(
    f: QueryFilter | QueryFilterArr | Array<QueryFilter | QueryFilterArr>,
    customOperators?: CustomOperators,
  ): this {
    this.setCondition(f, 'or', customOperators);
    return this;
  }

  setJoin(j: QueryJoin | QueryJoinArr | Array<QueryJoin | QueryJoinArr>): this {
    if (!isNil(j)) {
      const param = this.checkQueryObjectParam('join', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(j) && !isString(j[0])
          ? (j as Array<QueryJoin | QueryJoinArr>).map((o) => this.addJoin(o))
          : [this.addJoin(j as QueryJoin | QueryJoinArr)]),
      ];
    }
    return this;
  }

  sortBy(s: QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr>): this {
    if (!isNil(s)) {
      const param = this.checkQueryObjectParam('sort', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(s) && !isString(s[0])
          ? (s as Array<QuerySort | QuerySortArr>).map((o) => this.addSortBy(o))
          : [this.addSortBy(s as QuerySort | QuerySortArr)]),
      ];
    }
    return this;
  }

  setLimit(n: number): this {
    this.setNumeric(n, 'limit');
    return this;
  }

  setOffset(n: number): this {
    this.setNumeric(n, 'offset');
    return this;
  }

  setPage(n: number): this {
    this.setNumeric(n, 'page');
    return this;
  }

  resetCache(): this {
    this.setNumeric(0, 'cache');
    return this;
  }

  cond(
    f: QueryFilter | QueryFilterArr,
    cond: 'filter' | 'or' | 'search' = 'search',
    customOperators?: CustomOperators,
  ): string {
    const filter = Array.isArray(f) ? { field: f[0], operator: f[1], value: f[2] } : f;
    validateCondition(filter, cond, customOperators);
    const d = this.options.delim;

    return (
      filter.field +
      d +
      filter.operator +
      (hasValue(filter.value) ? d + filter.value : '')
    );
  }

  private addJoin(j: QueryJoin | QueryJoinArr): string {
    const join = Array.isArray(j) ? { field: j[0], select: j[1] } : j;
    validateJoin(join);
    const d = this.options.delim;
    const ds = this.options.delimStr;

    return join.field + (isArrayFull(join.select) ? d + join.select.join(ds) : '');
  }

  private addSortBy(s: QuerySort | QuerySortArr): string {
    const sort = Array.isArray(s) ? { field: s[0], order: s[1] } : s;
    validateSort(sort);
    const ds = this.options.delimStr;

    return sort.field + ds + sort.order;
  }

  private createFromParams(
    params: CreateQueryParams,
    customOperators: CustomOperators,
  ): this {
    this.select(params.fields);
    this.search(params.search);
    this.setFilter(params.filter, customOperators);
    this.setOr(params.or, customOperators);
    this.setJoin(params.join);
    this.setLimit(params.limit);
    this.setOffset(params.offset);
    this.setPage(params.page);
    this.sortBy(params.sort);
    if (params.resetCache) {
      this.resetCache();
    }
    return this;
  }

  private checkQueryObjectParam(
    cond: keyof RequestQueryBuilderOptions['paramNamesMap'],
    defaults: any,
  ): string {
    const param = this.paramNames[cond];
    if (isNil(this.queryObject[param]) && !isUndefined(defaults)) {
      this.queryObject[param] = defaults;
    }
    return param;
  }

  private setCondition(
    f: QueryFilter | QueryFilterArr | Array<QueryFilter | QueryFilterArr>,
    cond: 'filter' | 'or',
    customOperators: CustomOperators,
  ): void {
    if (!isNil(f)) {
      const param = this.checkQueryObjectParam(cond, []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(f) && !isString(f[0])
          ? (f as Array<QueryFilter | QueryFilterArr>).map((o) =>
              this.cond(o, cond, customOperators),
            )
          : [this.cond(f as QueryFilter | QueryFilterArr, cond, customOperators)]),
      ];
    }
  }

  private setNumeric(n: number, cond: 'limit' | 'offset' | 'page' | 'cache'): void {
    if (!isNil(n)) {
      validateNumeric(n, cond);
      this.queryObject[this.paramNames[cond]] = n;
    }
  }
}
