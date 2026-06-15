import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity.pipe';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsControllerDoc } from 'src/docs/tags/tags.controller.doc';
import { DuplicatedEntryPipe } from 'src/common/pipes/duplicated-entry.pipe';

@TagsControllerDoc.Controller()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @TagsControllerDoc.Create()
  @Post()
  create(
    @Body(DuplicatedEntryPipe(TagEntity, 'name')) createTagDto: CreateTagDto,
  ) {
    return this.tagsService.create(createTagDto);
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
    @Param('id', EntityExistsPipe(TagEntity)) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @TagsControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(TagEntity)) id: number) {
    return this.tagsService.remove(id);
  }
}
