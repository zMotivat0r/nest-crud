import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { isObjectFull } from '@nestjsx/util';
import * as deepmerge from 'deepmerge';

import { CrudGlobalConfig } from '../interfaces';

export class CrudConfigService {
  static config: CrudGlobalConfig = {
    auth: {},
    query: {
      alwaysPaginate: false,
    },
    operators: {},
    routes: {
      getManyBase: { interceptors: [], decorators: [] },
      getOneBase: { interceptors: [], decorators: [] },
      createOneBase: { interceptors: [], decorators: [], returnShallow: false },
      createManyBase: { interceptors: [], decorators: [] },
      updateOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      replaceOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
    },
    params: {},
  };

  static load(config: CrudGlobalConfig = {}) {
    const auth = isObjectFull(config.auth) ? config.auth : {};
    const query = isObjectFull(config.query) ? config.query : {};
    const routes = isObjectFull(config.routes) ? config.routes : {};
    const operators = isObjectFull(config.operators) ? config.operators : {};
    const params = isObjectFull(config.params) ? config.params : {};
    const serialize = isObjectFull(config.serialize) ? config.serialize : {};

    if (isObjectFull(config.queryParser)) {
      RequestQueryBuilder.setOptions({ ...config.queryParser });
    }

    CrudConfigService.config = deepmerge(
      CrudConfigService.config,
      { auth, query, routes, operators, params, serialize },
      { arrayMerge: (a, b, c) => b },
    );
  }
}
