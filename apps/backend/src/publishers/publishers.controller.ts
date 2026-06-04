import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PublishersControllerDoc } from 'src/docs/publishers/publishers.controller.doc';
import { Controller, Post, Body, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';

@PublishersControllerDoc.Controller()
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @PublishersControllerDoc.Create()
  @Post()
  create(@Body() dto: CreatePublisherDto) {
    return this.publishersService.create(dto);
  }

  @PublishersControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.publishersService.findAll(paginationQueryDto);
  }

  @PublishersControllerDoc.Update()
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(Publisher)) publisher: Publisher,
    @Body() dto: UpdatePublisherDto,
  ) {
    return this.publishersService.update(publisher.id, dto);
  }

  @PublishersControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(Publisher)) publisher: Publisher) {
    return this.publishersService.remove(publisher.id);
  }
}
