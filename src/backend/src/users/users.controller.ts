import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersControllerDoc } from 'src/docs/users/users.controller.doc';

@UsersControllerDoc.Controller()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsersControllerDoc.Index()
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.findAll(page, limit);
  }

  @UsersControllerDoc.GetOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id }).then(user => {
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    });
  }
}
