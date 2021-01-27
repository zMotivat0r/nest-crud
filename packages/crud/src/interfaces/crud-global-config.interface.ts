import { RequestQueryBuilderOptions } from '@nestjsx/crud-request';

import { AuthGlobalOptions } from './auth-options.interface';
import { OperatorsOptions } from './operators-options.interface';
import { ParamsOptions } from './params-options.interface';
import { RoutesOptions } from './routes-options.interface';

export interface CrudGlobalConfig {
  queryParser?: RequestQueryBuilderOptions;
  auth?: AuthGlobalOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  operators?: OperatorsOptions;
  query?: {
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
    alwaysPaginate?: boolean;
  };
  serialize?: {
    getMany?: false;
    get?: false;
    create?: false;
    createMany?: false;
    update?: false;
    replace?: false;
    delete?: false;
  };
}
