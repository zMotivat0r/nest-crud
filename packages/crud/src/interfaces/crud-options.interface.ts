import { ValidationPipeOptions } from '@nestjs/common';

import { AuthOptions } from './auth-options.interface';
import { DtoOptions } from './dto-options.interface';
import { ModelOptions } from './model-options.interface';
import { OperatorsOptions } from './operators-options.interface';
import { ParamsOptions } from './params-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { SerializeOptions } from './serialize-options.interface';

export interface CrudRequestOptions {
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  operators?: OperatorsOptions;
}

export interface CrudOptions {
  model: ModelOptions;
  dto?: DtoOptions;
  serialize?: SerializeOptions;
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  validation?: ValidationPipeOptions | false;
  operators?: OperatorsOptions;
}

export interface MergedCrudOptions extends CrudOptions {
  auth?: AuthOptions;
}
