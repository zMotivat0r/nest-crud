import {
  hasValue,
  isObject,
  isString,
  isArrayFull,
  isNil,
  isUndefined,
} from '@nestjsx/util';
import { stringify } from 'qs';

import { RequestQueryBuilderOptions, CreateQueryParams } from './interfaces';
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
export class RequestQueryBuilder<K extends string = string> {
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
      includeDeleted: 'include_deleted',
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

  static create(params?: CreateQueryParams): RequestQueryBuilder {
    const qb = new RequestQueryBuilder();
    return isObject(params) ? qb.createFromParams(params) : qb;
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

  select(fields: QueryFields<K>): this {
    if (isArrayFull(fields)) {
      validateFields(fields);
      this.queryObject[this.paramNames.fields] = fields.join(this.options.delimStr);
    }
    return this;
  }

  search(s: SCondition<K>) {
    if (!isNil(s) && isObject(s)) {
      this.queryObject[this.paramNames.search] = JSON.stringify(s);
    }
    return this;
  }

  setFilter(
    f: QueryFilter<K> | QueryFilterArr<K> | Array<QueryFilter<K> | QueryFilterArr<K>>,
  ): this {
    this.setCondition(f, 'filter');
    return this;
  }

  setOr(
    f: QueryFilter<K> | QueryFilterArr<K> | Array<QueryFilter<K> | QueryFilterArr<K>>,
  ): this {
    this.setCondition(f, 'or');
    return this;
  }

  setJoin(
    j: QueryJoin<K> | QueryJoinArr<K> | Array<QueryJoin<K> | QueryJoinArr<K>>,
  ): this {
    if (!isNil(j)) {
      const param = this.checkQueryObjectParam('join', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(j) && !isString(j[0])
          ? (j as Array<QueryJoin<K> | QueryJoinArr<K>>).map((o) => this.addJoin(o))
          : [this.addJoin(j as QueryJoin<K> | QueryJoinArr<K>)]),
      ];
    }
    return this;
  }

  sortBy(
    s: QuerySort<K> | QuerySortArr<K> | Array<QuerySort<K> | QuerySortArr<K>>,
  ): this {
    if (!isNil(s)) {
      const param = this.checkQueryObjectParam('sort', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(s) && !isString(s[0])
          ? (s as Array<QuerySort<K> | QuerySortArr<K>>).map((o) => this.addSortBy(o))
          : [this.addSortBy(s as QuerySort<K> | QuerySortArr<K>)]),
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

  setIncludeDeleted(n: number): this {
    this.setNumeric(n, 'includeDeleted');
    return this;
  }

  cond(
    f: QueryFilter<K> | QueryFilterArr<K>,
    cond: 'filter' | 'or' | 'search' = 'search',
  ): string {
    const filter = Array.isArray(f) ? { field: f[0], operator: f[1], value: f[2] } : f;
    validateCondition(filter, cond);
    const d = this.options.delim;

    return (
      filter.field +
      d +
      filter.operator +
      (hasValue(filter.value) ? d + filter.value : '')
    );
  }

  private addJoin(j: QueryJoin<K> | QueryJoinArr<K>): string {
    const join = Array.isArray(j) ? { field: j[0], select: j[1] } : j;
    validateJoin(join);
    const d = this.options.delim;
    const ds = this.options.delimStr;

    return join.field + (isArrayFull(join.select) ? d + join.select.join(ds) : '');
  }

  private addSortBy(s: QuerySort<K> | QuerySortArr<K>): string {
    const sort = Array.isArray(s) ? { field: s[0], order: s[1] } : s;
    validateSort(sort);
    const ds = this.options.delimStr;

    return sort.field + ds + sort.order;
  }

  private createFromParams(params: CreateQueryParams<K>): this {
    this.select(params.fields);
    this.search(params.search);
    this.setFilter(params.filter);
    this.setOr(params.or);
    this.setJoin(params.join);
    this.setLimit(params.limit);
    this.setOffset(params.offset);
    this.setPage(params.page);
    this.sortBy(params.sort);
    if (params.resetCache) {
      this.resetCache();
    }
    this.setIncludeDeleted(params.includeDeleted);
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
    f: QueryFilter<K> | QueryFilterArr<K> | Array<QueryFilter<K> | QueryFilterArr<K>>,
    cond: 'filter' | 'or',
  ): void {
    if (!isNil(f)) {
      const param = this.checkQueryObjectParam(cond, []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(f) && !isString(f[0])
          ? (f as Array<QueryFilter<K> | QueryFilterArr<K>>).map((o) =>
              this.cond(o, cond),
            )
          : [this.cond(f as QueryFilter<K> | QueryFilterArr<K>, cond)]),
      ];
    }
  }

  private setNumeric(
    n: number,
    cond: 'limit' | 'offset' | 'page' | 'cache' | 'includeDeleted',
  ): void {
    if (!isNil(n)) {
      validateNumeric(n, cond);
      this.queryObject[this.paramNames[cond]] = n;
    }
  }
}
