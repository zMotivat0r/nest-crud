import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { CrudGlobalConfig } from '../src/interfaces';
import { CrudConfigService } from '../src/module/crud-config.service';

describe('#crud', () => {
  describe('#CrudConfigService', () => {
    const defaultConfig = { ...CrudConfigService.config };

    beforeEach(() => {
      CrudConfigService.config = { ...defaultConfig };
    });

    it('should set default config, 1', () => {
      const conf: CrudGlobalConfig = {};
      const expected = { ...CrudConfigService.config };
      CrudConfigService.load(conf);
      expect(CrudConfigService.config).toEqual(expect.objectContaining(expected));
    });
    it('should set default config, 2', () => {
      const expected = { ...CrudConfigService.config };
      CrudConfigService.load();
      expect(CrudConfigService.config).toEqual(expect.objectContaining(expected));
    });
    it('should set queryParser', () => {
      const requestOptions = { ...RequestQueryBuilder.getOptions() };
      const conf: CrudGlobalConfig = {
        queryParser: {
          delim: '__',
        },
      };
      const expected = { ...CrudConfigService.config };
      CrudConfigService.load(conf);
      expect(CrudConfigService.config).toEqual(expect.objectContaining(expected));
      expect(RequestQueryBuilder.getOptions()).toEqual(
        expect.objectContaining({ ...requestOptions, delim: '__' }),
      );
    });
    it('should set query, routes, params', () => {
      const conf: CrudGlobalConfig = {
        auth: {
          property: 'user',
        },
        query: {
          limit: 10,
        },
        operators: {
          custom: {},
        },
        params: {
          id: {
            field: 'id',
            type: 'uuid',
            primary: true,
          },
        },
        routes: {
          updateOneBase: {
            allowParamsOverride: true,
            returnShallow: true,
          },
          replaceOneBase: {
            allowParamsOverride: true,
          },
          getManyBase: {
            interceptors: [() => {}],
          },
        },
      };
      const expected = {
        auth: {
          property: 'user',
        },
        query: {
          limit: 10,
        },
        operators: {
          custom: {},
        },
        params: {
          id: {
            field: 'id',
            type: 'uuid',
            primary: true,
          },
        },
        routes: {
          getManyBase: {
            interceptors: [() => {}],
            decorators: [],
          },
          getOneBase: { interceptors: [], decorators: [] },
          createOneBase: { interceptors: [], decorators: [], returnShallow: false },
          createManyBase: { interceptors: [], decorators: [] },
          updateOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: true,
            returnShallow: true,
          },
          replaceOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: true,
            returnShallow: false,
          },
          deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
        },
      };
      CrudConfigService.load(conf);
      expect(CrudConfigService.config.params).toEqual(
        expect.objectContaining(expected.params),
      );
      expect(CrudConfigService.config.query).toEqual(
        expect.objectContaining(expected.query),
      );
      expect(CrudConfigService.config.operators).toEqual(
        expect.objectContaining(expected.operators),
      );
      expect(JSON.stringify(CrudConfigService.config.routes)).toEqual(
        JSON.stringify(expected.routes),
      );
    });
  });
});
