import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudAuth } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getOneBase', 'updateOneBase'],
  },
  params: {
    id: {
      primary: true,
      disabled: true,
    },
  },
  query: {
    join: {
      company: {
        eager: true,
      },
      profile: {
        eager: true,
      },
    },
  },
})
@CrudAuth({
  property: "user",
  filter: (user: User) => ({
    id: user.id,
  }),
})
@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(public service: UsersService) {}
}
