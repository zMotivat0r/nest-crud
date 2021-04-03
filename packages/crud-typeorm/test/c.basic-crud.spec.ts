import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Crud } from '@nestjsx/crud';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import * as request from 'supertest';
import { Company } from '../../../integration/crud-typeorm/companies';
import { Device } from '../../../integration/crud-typeorm/devices';
import { withCache } from '../../../integration/crud-typeorm/orm.config';
import { Project } from '../../../integration/crud-typeorm/projects';
import { User } from '../../../integration/crud-typeorm/users';
import { UserProfile } from '../../../integration/crud-typeorm/users-profiles';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { CompaniesService } from './__fixture__/companies.service';
import { UsersService } from './__fixture__/users.service';
import { DevicesService } from './__fixture__/devices.service';

const isMysql = process.env.TYPEORM_CONNECTION === 'mysql';

// tslint:disable:max-classes-per-file no-shadowed-variable
describe('#crud-typeorm', () => {
  describe('#basic crud using alwaysPaginate default respects global limit', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
      query: {
        alwaysPaginate: true,
        limit: 3,
      },
    })
    @Controller('companies0')
    class CompaniesController0 {
      constructor(public service: CompaniesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [TypeOrmModule.forRoot(withCache), TypeOrmModule.forFeature([Company])],
        controllers: [CompaniesController0],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
        ],
      }).compile();

      app = fixture.createNestApplication();
      service = app.get<CompaniesService>(CompaniesService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', (done) => {
        return request(server)
          .get('/companies0')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.page).toBe(1);
            done();
          });
      });
    });
  });

  describe('#basic crud using alwaysPaginate default', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
      query: { alwaysPaginate: true },
    })
    @Controller('companies')
    class CompaniesController {
      constructor(public service: CompaniesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [TypeOrmModule.forRoot(withCache), TypeOrmModule.forFeature([Company])],
        controllers: [CompaniesController],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
        ],
      }).compile();

      app = fixture.createNestApplication();
      service = app.get<CompaniesService>(CompaniesService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', (done) => {
        return request(server)
          .get('/companies')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(9);
            expect(res.body.page).toBe(1);
            done();
          });
      });
      it('should return an entities with limit', (done) => {
        const query = qb.setLimit(5).query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(5);
            expect(res.body.page).toBe(1);
            done();
          });
      });
      it('should return an entities with limit and page', (done) => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: 'id', order: 'DESC' })
          .query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.page).toBe(1);
            done();
          });
      });
    });
  });

  describe('#basic crud', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
      query: {
        softDelete: true,
      },
    })
    @Controller('companies')
    class CompaniesController {
      constructor(public service: CompaniesService) {}
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
      routes: {
        deleteOneBase: {
          returnDeleted: true,
        },
      },
      query: {
        persist: ['isActive'],
        cache: 10000,
      },
      validation: {
        transform: true,
      },
    })
    @Controller('companies/:companyId/users')
    class UsersController {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: User },
      query: {
        join: {
          profile: {
            eager: true,
            required: true,
          },
        },
      },
    })
    @Controller('/users2')
    class UsersController2 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: User },
      query: {
        join: {
          profile: {
            eager: true,
          },
        },
      },
    })
    @Controller('/users3')
    class UsersController3 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: User },
      params: {
        companyId: { field: 'companyId', type: 'number', primary: true },
        profileId: { field: 'profileId', type: 'number', primary: true },
      },
    })
    @Controller('users4')
    class UsersController4 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: Device },
      params: {
        deviceKey: {
          field: 'deviceKey',
          type: 'uuid',
          primary: true,
        },
      },
      routes: {
        createOneBase: {
          returnShallow: true,
        },
      },
    })
    @Controller('devices')
    class DevicesController {
      constructor(public service: DevicesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({ ...withCache, logging: false }),
          TypeOrmModule.forFeature([Company, Project, User, UserProfile, Device]),
        ],
        controllers: [
          CompaniesController,
          UsersController,
          UsersController2,
          UsersController3,
          UsersController4,
          DevicesController,
        ],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
          UsersService,
          DevicesService,
        ],
      }).compile();

      app = fixture.createNestApplication();
      service = app.get<CompaniesService>(CompaniesService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#find', () => {
      it('should return entities', async () => {
        const data = await service.find();
        expect(data.length).toBe(9);
      });
    });

    describe('#findOne', () => {
      it('should return one entity', async () => {
        const data = await service.findOne(1);
        expect(data.id).toBe(1);
      });
    });

    describe('#count', () => {
      it('should return number', async () => {
        const data = await service.count();
        expect(typeof data).toBe('number');
      });
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', (done) => {
        return request(server)
          .get('/companies?include_deleted=1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            done();
          });
      });
      it('should return an entities with limit', (done) => {
        const query = qb.setLimit(5).query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(5);
            done();
          });
      });
      it('should return an entities with limit and page', (done) => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: 'id', order: 'DESC' })
          .query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.total).toBe(9);
            expect(res.body.page).toBe(1);
            expect(res.body.pageCount).toBe(3);
            done();
          });
      });
      it('should return an entities with offset', (done) => {
        const queryObj = qb.setOffset(3);
        if (isMysql) {
          queryObj.setLimit(10);
        }
        const query = queryObj.query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            if (isMysql) {
              expect(res.body.count).toBe(6);
              expect(res.body.data.length).toBe(6);
            } else {
              expect(res.body.length).toBe(6);
            }
            done();
          });
      });
    });

    describe('#getOneBase', () => {
      it('should return status 404', (done) => {
        return request(server)
          .get('/companies/333')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return status 404 for deleted entity', (done) => {
        return request(server)
          .get('/companies/9')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return a deleted entity if include_deleted query param is specified', (done) => {
        return request(server)
          .get('/companies/9?include_deleted=1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(9);
            done();
          });
      });
      it('should return an entity, 1', (done) => {
        return request(server)
          .get('/companies/1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            done();
          });
      });
      it('should return an entity, 2', (done) => {
        const query = qb.select(['domain']).query();
        return request(server)
          .get('/companies/1')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.domain).toBeTruthy();
            done();
          });
      });
      it('should return an entity with compound key', (done) => {
        return request(server)
          .get('/users4/1/5')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(5);
            done();
          });
      });
      it('should return an entity with and set cache', (done) => {
        return request(server)
          .get('/companies/1/users/1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });

      it('should return an entity with its embedded entity properties', (done) => {
        return request(server)
          .get('/companies/1/users/1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.name.first).toBe('firstname1');
            expect(res.body.name.last).toBe('lastname1');
            done();
          });
      });
    });

    describe('#createOneBase', () => {
      it('should return status 400', (done) => {
        return request(server)
          .post('/companies')
          .send('')
          .end((_, res) => {
            expect(res.status).toBe(400);
            done();
          });
      });
      it('should return saved entity', (done) => {
        const dto = {
          name: 'test0',
          domain: 'test0',
        };
        return request(server)
          .post('/companies')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
            done();
          });
      });
      it('should return saved entity with param', (done) => {
        const dto: any = {
          email: 'test@test.com',
          isActive: true,
          name: {
            first: 'test',
            last: 'last',
          },
          profile: {
            name: 'testName',
          },
        };
        return request(server)
          .post('/companies/1/users')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
      it('should return with `returnShallow`', (done) => {
        const dto: any = { description: 'returnShallow is true' };
        return request(server)
          .post('/devices')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body.deviceKey).toBeTruthy();
            expect(res.body.description).toBeTruthy();
            done();
          });
      });
    });

    describe('#createManyBase', () => {
      it('should return status 400', (done) => {
        const dto = { bulk: [] };
        return request(server)
          .post('/companies/bulk')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(400);
            done();
          });
      });
      it('should return created entities', (done) => {
        const dto = {
          bulk: [
            {
              name: 'test1',
              domain: 'test1',
            },
            {
              name: 'test2',
              domain: 'test2',
            },
          ],
        };
        return request(server)
          .post('/companies/bulk')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body[0].id).toBeTruthy();
            expect(res.body[1].id).toBeTruthy();
            done();
          });
      });
    });

    describe('#updateOneBase', () => {
      it('should return status 404', (done) => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/333')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return updated entity, 1', (done) => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/1')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
            done();
          });
      });
      it('should return updated entity, 2', (done) => {
        const dto = { isActive: false, companyId: 5 };
        return request(server)
          .patch('/companies/1/users/22')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.isActive).toBe(false);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
    });

    describe('#replaceOneBase', () => {
      it('should create entity', (done) => {
        const dto = { name: 'updated0', domain: 'domain0' };
        return request(server)
          .put('/companies/333')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
            done();
          });
      });
      it('should return updated entity, 1', (done) => {
        const dto = { name: 'updated0' };
        return request(server)
          .put('/companies/1')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
            done();
          });
      });
    });

    describe('#deleteOneBase', () => {
      it('should return status 404', (done) => {
        return request(server)
          .delete('/companies/3333')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should softly delete entity', (done) => {
        return request(server)
          .delete('/companies/5')
          .end((_, res) => {
            expect(res.status).toBe(200);
            done();
          });
      });
      it('should not return softly deleted entity', (done) => {
        return request(server)
          .get('/companies/5')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should recover softly deleted entity', (done) => {
        return request(server)
          .patch('/companies/5/recover')
          .end((_, res) => {
            expect(res.status).toBe(200);
            done();
          });
      });
      it('should return recovered entity', (done) => {
        return request(server)
          .get('/companies/5')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(5);
            done();
          });
      });
      it('should return deleted entity', (done) => {
        return request(server)
          .delete('/companies/1/users/22')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(22);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
    });

    describe('join options: required', () => {
      const users2 = () => request(server).get('/users2/21');
      const users3 = () => request(server).get('/users3/21');

      it('should return status 404', async () => {
        await users2().expect(404);
      });

      it('should return status 200', async () => {
        const res = await users3().expect(200);
        expect(res.body.id).toBe(21);
        expect(res.body.profile).toBe(null);
      });
    });
  });
});
