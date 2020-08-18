import 'jest-extended';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../../../integration/crud-objection/users';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { Crud } from '../../crud/src/decorators/crud.decorator';
import { UsersService } from './__fixture__/users.service';
import { DatabaseModule } from '../../../integration/crud-objection/database.module';
import { KNEX_CONNECTION } from '../../../integration/crud-objection/injection-tokens';

// tslint:disable:max-classes-per-file
describe('#crud-objection', () => {
  describe('#params options', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: User },
      params: {
        companyId: {
          field: 'companyId',
          type: 'number',
        },
        id: {
          field: 'id',
          type: 'number',
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
          returnShallow: true,
        },
      },
    })
    @Controller('/companiesA/:companyId/users')
    class UsersController1 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: User },
      params: {
        companyId: {
          field: 'companyId',
          type: 'number',
        },
        id: {
          field: 'id',
          type: 'number',
          primary: true,
        },
      },
      query: {
        join: {
          company: {
            eager: true,
          },
        },
      },
    })
    @Controller('/companiesB/:companyId/users')
    class UsersController2 {
      constructor(public service: UsersService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [DatabaseModule],
        controllers: [UsersController1, UsersController2],
        providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }, UsersService],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = app.getHttpServer();
    });

    afterAll(async () => {
      const knex = app.get(KNEX_CONNECTION);
      await knex.destroy();
      await app.close();
    });

    describe('#updateOneBase', () => {
      it('should override params', async () => {
        const dto = { isActive: false, companyId: 2 };
        const res = await request(server)
          .patch('/companiesA/1/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(2);
      });
      it('should not override params', async () => {
        const dto = { isActive: false, companyId: 2 };
        const res = await request(server)
          .patch('/companiesB/1/users/3')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(1);
      });
      it('should return full entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .patch('/companiesB/2/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.company.id).toBe(2);
      });
      it('should return shallow entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .patch('/companiesA/2/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.company).toBeUndefined();
      });
    });

    describe('#replaceOneBase', () => {
      it('should override params', async () => {
        const dto = { isActive: false, companyId: 2, email: '4@email.com' };
        const res = await request(server)
          .put('/companiesA/1/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(2);
      });
      it('should not override params', async () => {
        const dto = { isActive: false, companyId: 1 };
        const res = await request(server)
          .put('/companiesB/2/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(2);
      });
      it('should return full entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .put('/companiesB/2/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.company.id).toBe(2);
      });
      it('should return shallow entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .put('/companiesA/2/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.company).toBeUndefined();
      });
    });
  });
});
