import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { TagsControllerDoc } from 'src/docs/tags/tags.controller.doc';
import { DuplicatedEntryPipe } from 'src/common/entities/pipes/duplicated-entry.pipe';
import { EntityExistsPipe } from 'src/common/entities/pipes/entity-exists.pipe';
import { TagMapper } from './tag.mapper';

@TagsControllerDoc.Controller()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @TagsControllerDoc.Create()
  @Post()
  async create(
    @Body(DuplicatedEntryPipe(TagEntity, 'name')) createTagDto: CreateTagDto,
  ) {
    return TagMapper.toTag(await this.tagsService.create(createTagDto));
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
    @Param('id', ParseIntPipe, EntityExistsPipe(TagEntity)) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @TagsControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe, EntityExistsPipe(TagEntity)) id: number) {
    return this.tagsService.remove(id);
  }
}
