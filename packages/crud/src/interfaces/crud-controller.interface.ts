import { CreateManyDto, CrudRequest, GetManyDefaultResponse } from '../interfaces';
import { CrudService } from '../services';

export interface CrudController<T> {
  service: CrudService<T>;
  getManyBase?(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  getOneBase?(req: CrudRequest): Promise<T>;
  createOneBase?(req: CrudRequest, dto: T): Promise<T>;
  createManyBase?(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]>;
  updateOneBase?(req: CrudRequest, dto: T): Promise<T>;
  replaceOneBase?(req: CrudRequest, dto: T): Promise<T>;
  deleteOneBase?(req: CrudRequest): Promise<void | T>;
}
