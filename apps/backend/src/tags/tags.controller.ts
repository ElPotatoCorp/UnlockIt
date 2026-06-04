import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsControllerDoc } from 'src/docs/tags/tags.controller.doc';

@TagsControllerDoc.Controller()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @TagsControllerDoc.Create()
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @TagsControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.tagsService.findAll(paginationQueryDto);
  }

  @TagsControllerDoc.Update()
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(Tag)) tag: Tag,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tagsService.update(tag.id, dto);
  }

  @TagsControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(Tag)) tag: Tag) {
    return this.tagsService.remove(tag.id);
  }
}