import { CrudService } from '../services';
import { CrudRequest, GetManyDefaultResponse, CreateManyDto } from '../interfaces';

export interface CrudController<T> {
  service: CrudService<T>;
  getManyBase?(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  getOneBase?(req: CrudRequest): Promise<T>;
  createOneBase?(req: CrudRequest, dto: T): Promise<T>;
  createManyBase?(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]>;
  updateOneBase?(req: CrudRequest, dto: Partial<T>): Promise<T>;
  replaceOneBase?(req: CrudRequest, dto: T): Promise<T>;
  deleteOneBase?(req: CrudRequest): Promise<void | T>;
  recoverOneBase?(req: CrudRequest): Promise<void | T>;
}
