import { Controller, Post, Body, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from './entities/developer.entity';
import { DevelopersControllerDoc } from 'src/docs/developers/developers.controller.doc';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';

@DevelopersControllerDoc.Controller()
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @DevelopersControllerDoc.Create()
  @Post()
  create(@Body() dto: CreateDeveloperDto) {
    return this.developersService.create(dto);
  }

  @DevelopersControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.developersService.findAll(paginationQueryDto);
  }

  @DevelopersControllerDoc.Update()
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(Developer)) developer: Developer,
    @Body() dto: UpdateDeveloperDto,
  ) {
    return this.developersService.update(developer.id, dto);
  }

  @DevelopersControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(Developer)) developer: Developer) {
    return this.developersService.remove(developer.id);
  }
}