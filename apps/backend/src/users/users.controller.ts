import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersControllerDoc } from 'src/docs/users/users.controller.doc';
import { PublicUserDto } from 'src/user/dto/public-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne({ id }).then((user) => {
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return PublicUserDto.fromEntity(user);
    });
  }
}
