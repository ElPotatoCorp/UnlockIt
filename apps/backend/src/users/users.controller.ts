import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersControllerDoc } from 'src/docs/users/users.controller.doc';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { EntityFetchPipe } from 'src/common/entities/pipes/fetch-entity.pipe';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserMapper } from 'src/user/user.mapper';

@UsersControllerDoc.Controller()
@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsersControllerDoc.Index()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findAll(paginationQueryDto);
  }

  @UsersControllerDoc.GetOne()
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ version: '4' }),
      EntityFetchPipe(UserEntity),
    )
    user: UserEntity,
  ) {
    return UserMapper.toPublic(user);
  }
}
