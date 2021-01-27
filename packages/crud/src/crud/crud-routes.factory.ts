import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  getOwnPropNames,
  isArrayFull,
  isEqual,
  isFalse,
  isFunction,
  isIn,
  isNil,
  isObjectFull,
  isUndefined,
  objKeys,
} from '@nestjsx/util';
import * as deepmerge from 'deepmerge';

import { CrudActions, CrudValidationGroups } from '../enums';
import { CrudRequestInterceptor, CrudResponseInterceptor } from '../interceptors';
import { BaseRoute, CrudOptions, CrudRequest, MergedCrudOptions } from '../interfaces';
import { CrudConfigService } from '../module';
import { BaseRouteName } from '../types';
import { R } from './reflection.helper';
import { SerializeHelper } from './serialize.helper';
import { Swagger } from './swagger.helper';
import { Validation } from './validation.helper';

export class CrudRoutesFactory {
  protected options: MergedCrudOptions;
  protected swaggerModels: any = {};

  constructor(private target: any, options: CrudOptions) {
    this.options = options;
    this.create();
  }

  static create(target: any, options: CrudOptions): CrudRoutesFactory {
    return new CrudRoutesFactory(target, options);
  }

  private get targetProto(): any {
    return this.target.prototype;
  }

  private get modelName(): string {
    return this.options.model.type.name;
  }

  private get modelType(): any {
    return this.options.model.type;
  }

  private get actionsMap(): { [key in BaseRouteName]: CrudActions } {
    return {
      getManyBase: CrudActions.ReadAll,
      getOneBase: CrudActions.ReadOne,
      createManyBase: CrudActions.CreateMany,
      createOneBase: CrudActions.CreateOne,
      updateOneBase: CrudActions.UpdateOne,
      deleteOneBase: CrudActions.DeleteOne,
      replaceOneBase: CrudActions.ReplaceOne,
    };
  }

  private create() {
    const routesSchema = this.getRoutesSchema();
    this.mergeOptions();
    this.setResponseModels();
    this.createRoutes(routesSchema);
    this.overrideRoutes(routesSchema);
    this.enableRoutes(routesSchema);
  }

  private mergeOptions() {
    // merge auth config
    const authOptions = R.getCrudAuthOptions(this.target);
    this.options.auth = isObjectFull(authOptions) ? authOptions : {};
    if (isUndefined(this.options.auth.property)) {
      this.options.auth.property = CrudConfigService.config.auth.property;
    }

    // merge query config
    const query = isObjectFull(this.options.query) ? this.options.query : {};
    this.options.query = { ...CrudConfigService.config.query, ...query };

    // merge routes config
    const routes = isObjectFull(this.options.routes) ? this.options.routes : {};
    this.options.routes = deepmerge(CrudConfigService.config.routes, routes, {
      arrayMerge: (a, b, c) => b,
    });

    // merge operators config
    const operators = isObjectFull(this.options.operators) ? this.options.operators : {};
    this.options.operators = deepmerge(CrudConfigService.config.operators, operators);

    // set params
    this.options.params = isObjectFull(this.options.params)
      ? this.options.params
      : isObjectFull(CrudConfigService.config.params)
      ? CrudConfigService.config.params
      : {};
    const hasPrimary = this.getPrimaryParams().length > 0;
    if (!hasPrimary) {
      this.options.params.id = {
        field: 'id',
        type: 'number',
        primary: true,
      };
    }

    // set dto
    if (!isObjectFull(this.options.dto)) {
      this.options.dto = {};
    }

    // set serialize
    const serialize = isObjectFull(this.options.serialize) ? this.options.serialize : {};
    this.options.serialize = { ...CrudConfigService.config.serialize, ...serialize };
    this.options.serialize.get = isFalse(this.options.serialize.get)
      ? false
      : this.options.serialize.get || this.modelType;
    this.options.serialize.getMany = isFalse(this.options.serialize.getMany)
      ? false
      : this.options.serialize.getMany
      ? this.options.serialize.getMany
      : isFalse(this.options.serialize.get)
      ? /* istanbul ignore next */ false
      : SerializeHelper.createGetManyDto(this.options.serialize.get, this.modelName);
    this.options.serialize.create = isFalse(this.options.serialize.create)
      ? false
      : this.options.serialize.create || this.modelType;
    this.options.serialize.update = isFalse(this.options.serialize.update)
      ? false
      : this.options.serialize.update || this.modelType;
    this.options.serialize.replace = isFalse(this.options.serialize.replace)
      ? false
      : this.options.serialize.replace || this.modelType;
    this.options.serialize.delete =
      isFalse(this.options.serialize.delete) ||
      !this.options.routes.deleteOneBase.returnDeleted
        ? false
        : this.options.serialize.delete || this.modelType;

    R.setCrudOptions(this.options, this.target);
  }

  private getRoutesSchema(): BaseRoute[] {
    return [
      {
        name: 'getOneBase',
        path: '/',
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'getManyBase',
        path: '/',
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'createOneBase',
        path: '/',
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'createManyBase',
        path: '/bulk',
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'updateOneBase',
        path: '/',
        method: RequestMethod.PATCH,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'replaceOneBase',
        path: '/',
        method: RequestMethod.PUT,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'deleteOneBase',
        path: '/',
        method: RequestMethod.DELETE,
        enable: false,
        override: false,
        withParams: true,
      },
    ];
  }

  private getManyBase(name: BaseRouteName) {
    this.targetProto[name] = function getManyBase(req: CrudRequest) {
      return this.service.getMany(req);
    };
  }

  private getOneBase(name: BaseRouteName) {
    this.targetProto[name] = function getOneBase(req: CrudRequest) {
      return this.service.getOne(req);
    };
  }

  private createOneBase(name: BaseRouteName) {
    this.targetProto[name] = function createOneBase(req: CrudRequest, dto: any) {
      return this.service.createOne(req, dto);
    };
  }

  private createManyBase(name: BaseRouteName) {
    this.targetProto[name] = function createManyBase(req: CrudRequest, dto: any) {
      return this.service.createMany(req, dto);
    };
  }

  private updateOneBase(name: BaseRouteName) {
    this.targetProto[name] = function updateOneBase(req: CrudRequest, dto: any) {
      return this.service.updateOne(req, dto);
    };
  }

  private replaceOneBase(name: BaseRouteName) {
    this.targetProto[name] = function replaceOneBase(req: CrudRequest, dto: any) {
      return this.service.replaceOne(req, dto);
    };
  }

  private deleteOneBase(name: BaseRouteName) {
    this.targetProto[name] = function deleteOneBase(req: CrudRequest) {
      return this.service.deleteOne(req);
    };
  }

  private canCreateRoute(name: string) {
    const only = this.options.routes.only;
    const exclude = this.options.routes.exclude;

    if (isArrayFull(only)) {
      return only.some((route) => route === name);
    }

    if (isArrayFull(exclude)) {
      return !exclude.some((route) => route === name);
    }

    return true;
  }

  private setResponseModels() {
    const modelType = isFunction(this.modelType)
      ? this.modelType
      : SerializeHelper.createGetOneResponseDto(this.modelName);
    this.swaggerModels.get = isFunction(this.options.serialize.get)
      ? this.options.serialize.get
      : modelType;
    this.swaggerModels.getMany =
      this.options.serialize.getMany ||
      SerializeHelper.createGetManyDto(this.swaggerModels.get, this.modelName);
    this.swaggerModels.create = isFunction(this.options.serialize.create)
      ? this.options.serialize.create
      : modelType;
    this.swaggerModels.update = isFunction(this.options.serialize.update)
      ? this.options.serialize.update
      : modelType;
    this.swaggerModels.replace = isFunction(this.options.serialize.replace)
      ? this.options.serialize.replace
      : modelType;
    this.swaggerModels.delete = isFunction(this.options.serialize.delete)
      ? this.options.serialize.delete
      : modelType;
    Swagger.setExtraModels(this.swaggerModels);
  }

  private createRoutes(routesSchema: BaseRoute[]) {
    const primaryParams = this.getPrimaryParams().filter(
      (param) => !this.options.params[param].disabled,
    );

    routesSchema.forEach((route) => {
      if (this.canCreateRoute(route.name)) {
        // create base method
        this[route.name](route.name);
        route.enable = true;
        // set metadata
        this.setBaseRouteMeta(route.name);
      }

      if (route.withParams && primaryParams.length > 0) {
        route.path = primaryParams.map((param) => `/:${param}`).join('');
      }
    });
  }

  private overrideRoutes(routesSchema: BaseRoute[]) {
    getOwnPropNames(this.targetProto).forEach((name) => {
      const override = R.getOverrideRoute(this.targetProto[name]);
      const route = routesSchema.find((r) => isEqual(r.name, override));

      if (override && route && route.enable) {
        // get metadata
        const interceptors = R.getInterceptors(this.targetProto[name]);
        const baseInterceptors = R.getInterceptors(this.targetProto[override]);
        const baseAction = R.getAction(this.targetProto[override]);
        const operation = Swagger.getOperation(this.targetProto[name]);
        const baseOperation = Swagger.getOperation(this.targetProto[override]);
        const swaggerParams = Swagger.getParams(this.targetProto[name]);
        const baseSwaggerParams = Swagger.getParams(this.targetProto[override]);
        const responseOk = Swagger.getResponseOk(this.targetProto[name]);
        const baseResponseOk = Swagger.getResponseOk(this.targetProto[override]);
        // set metadata
        R.setInterceptors([...baseInterceptors, ...interceptors], this.targetProto[name]);
        R.setAction(baseAction, this.targetProto[name]);
        Swagger.setOperation({ ...baseOperation, ...operation }, this.targetProto[name]);
        Swagger.setParams(
          [...baseSwaggerParams, ...swaggerParams],
          this.targetProto[name],
        );
        Swagger.setResponseOk(
          { ...baseResponseOk, ...responseOk },
          this.targetProto[name],
        );
        this.overrideParsedBodyDecorator(override, name);
        // enable route
        R.setRoute(route, this.targetProto[name]);
        route.override = true;
      }
    });
  }

  private enableRoutes(routesSchema: BaseRoute[]) {
    routesSchema.forEach((route) => {
      if (!route.override && route.enable) {
        R.setRoute(route, this.targetProto[route.name]);
      }
    });
  }

  private overrideParsedBodyDecorator(override: BaseRouteName, name: string) {
    const allowed = [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
    ] as BaseRouteName[];
    const withBody = isIn(override, allowed);
    const parsedBody = R.getParsedBody(this.targetProto[name]);

    if (withBody && parsedBody) {
      const baseKey = `${RouteParamtypes.BODY}:1`;
      const key = `${RouteParamtypes.BODY}:${parsedBody.index}`;
      const baseRouteArgs = R.getRouteArgs(this.target, override);
      const routeArgs = R.getRouteArgs(this.target, name);
      const baseBodyArg = baseRouteArgs[baseKey];
      R.setRouteArgs(
        {
          ...routeArgs,
          [key]: {
            ...baseBodyArg,
            index: parsedBody.index,
          },
        },
        this.target,
        name,
      );

      /* istanbul ignore else */
      if (isEqual(override, 'createManyBase')) {
        const paramTypes = R.getRouteArgsTypes(this.targetProto, name);
        const metatype = paramTypes[parsedBody.index];
        const types = [String, Boolean, Number, Array, Object];
        const toCopy =
          isIn(metatype, types) || /* istanbul ignore next */ isNil(metatype);

        /* istanbul ignore else */
        if (toCopy) {
          const baseParamTypes = R.getRouteArgsTypes(this.targetProto, override);
          const baseMetatype = baseParamTypes[1];
          paramTypes.splice(parsedBody.index, 1, baseMetatype);
          R.setRouteArgsTypes(paramTypes, this.targetProto, name);
        }
      }
    }
  }

  private getPrimaryParams(): string[] {
    return objKeys(this.options.params).filter(
      (param) => this.options.params[param] && this.options.params[param].primary,
    );
  }

  private setBaseRouteMeta(name: BaseRouteName) {
    this.setRouteArgs(name);
    this.setRouteArgsTypes(name);
    this.setInterceptors(name);
    this.setAction(name);
    this.setSwaggerOperation(name);
    this.setSwaggerPathParams(name);
    this.setSwaggerQueryParams(name);
    this.setSwaggerResponseOk(name);
    // set decorators after Swagger so metadata can be overwritten
    this.setDecorators(name);
  }

  private setRouteArgs(name: BaseRouteName) {
    let rest = {};
    const routes: BaseRouteName[] = [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
    ];

    if (isIn(name, routes)) {
      const action = this.routeNameAction(name);
      const hasDto = !isNil(this.options.dto[action]);
      const { UPDATE, CREATE } = CrudValidationGroups;
      const groupEnum = isIn(name, ['updateOneBase', 'replaceOneBase']) ? UPDATE : CREATE;
      const group = !hasDto ? groupEnum : undefined;

      rest = R.setBodyArg(1, [Validation.getValidationPipe(this.options, group)]);
    }

    R.setRouteArgs({ ...R.setParsedRequestArg(0), ...rest }, this.target, name);
  }

  private setRouteArgsTypes(name: BaseRouteName) {
    if (isEqual(name, 'createManyBase')) {
      const bulkDto = Validation.createBulkDto(this.options);
      R.setRouteArgsTypes([Object, bulkDto], this.targetProto, name);
    } else if (isIn(name, ['createOneBase', 'updateOneBase', 'replaceOneBase'])) {
      const action = this.routeNameAction(name);
      const dto = this.options.dto[action] || this.modelType;
      R.setRouteArgsTypes([Object, dto], this.targetProto, name);
    } else {
      R.setRouteArgsTypes([Object], this.targetProto, name);
    }
  }

  private setInterceptors(name: BaseRouteName) {
    const interceptors = this.options.routes[name].interceptors;
    R.setInterceptors(
      [
        CrudRequestInterceptor,
        CrudResponseInterceptor,
        ...(isArrayFull(interceptors) ? /* istanbul ignore next */ interceptors : []),
      ],
      this.targetProto[name],
    );
  }

  private setDecorators(name: BaseRouteName) {
    const decorators = this.options.routes[name].decorators;
    R.setDecorators(
      isArrayFull(decorators) ? /* istanbul ignore next */ decorators : [],
      this.targetProto,
      name,
    );
  }

  private setAction(name: BaseRouteName) {
    R.setAction(this.actionsMap[name], this.targetProto[name]);
  }

  private setSwaggerOperation(name: BaseRouteName) {
    const summary = Swagger.operationsMap(this.modelName)[name];
    const operationId = name + this.targetProto.constructor.name + this.modelName;
    Swagger.setOperation({ summary, operationId }, this.targetProto[name]);
  }

  private setSwaggerPathParams(name: BaseRouteName) {
    const metadata = Swagger.getParams(this.targetProto[name]);
    const withoutPrimary: BaseRouteName[] = [
      'createManyBase',
      'createOneBase',
      'getManyBase',
    ];
    const params = isIn(name, withoutPrimary)
      ? objKeys(this.options.params).reduce(
          (a, c) =>
            this.options.params[c].primary ? a : { ...a, [c]: this.options.params[c] },
          {},
        )
      : this.options.params;
    const pathParamsMeta = Swagger.createPathParamsMeta(params);
    Swagger.setParams([...metadata, ...pathParamsMeta], this.targetProto[name]);
  }

  private setSwaggerQueryParams(name: BaseRouteName) {
    const metadata = Swagger.getParams(this.targetProto[name]);
    const queryParamsMeta = Swagger.createQueryParamsMeta(name);
    Swagger.setParams([...metadata, ...queryParamsMeta], this.targetProto[name]);
  }

  private setSwaggerResponseOk(name: BaseRouteName) {
    const metadata = Swagger.getResponseOk(this.targetProto[name]);
    const metadataToAdd =
      Swagger.createResponseMeta(name, this.options, this.swaggerModels) ||
      /* istanbul ignore next */ {};
    Swagger.setResponseOk({ ...metadata, ...metadataToAdd }, this.targetProto[name]);
  }

  private routeNameAction(name: BaseRouteName): string {
    return (
      name.split('OneBase')[0] || /* istanbul ignore next */ name.split('ManyBase')[0]
    );
  }
}
