import { ExecutionContext } from '@nestjs/common';
import { R } from '../crud/reflection.helper';
import { CrudActions } from '../enums';
import { MergedCrudOptions } from '../interfaces';

export class CrudBaseInterceptor {
  protected getCrudInfo(
    context: ExecutionContext,
  ): {
    ctrlOptions: MergedCrudOptions;
    crudOptions: Partial<MergedCrudOptions>;
    action: CrudActions;
  } {
    const ctrl = context.getClass();
    const handler = context.getHandler();
    const ctrlOptions = R.getCrudOptions(ctrl);
    const crudOptions = ctrlOptions
      ? ctrlOptions
      : {
          query: {},
          routes: {},
          params: {},
          operators: {},
        };
    const action = R.getAction(handler);

    return { ctrlOptions, crudOptions, action };
  }
}
