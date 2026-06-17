import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { DeveloperEntity } from './entities/developer.entity';
import { DevelopersControllerDoc } from 'src/docs/developers/developers.controller.doc';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { DuplicatedEntryPipe } from 'src/common/entities/pipes/duplicated-entry.pipe';
import { EntityExistsPipe } from 'src/common/entities/pipes/entity-exists.pipe';

@DevelopersControllerDoc.Controller()
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @DevelopersControllerDoc.Create()
  @Post()
  create(@Body(DuplicatedEntryPipe(DeveloperEntity, 'name')) dto: CreateDeveloperDto) {
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
    @Param('id', ParseIntPipe, EntityExistsPipe(DeveloperEntity)) id: number,
    @Body() dto: UpdateDeveloperDto,
  ) {
    return this.developersService.update(id, dto);
  }

  @DevelopersControllerDoc.Remove()
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe, EntityExistsPipe(DeveloperEntity)) id: number,
  ) {
    return this.developersService.remove(id);
  }
}
