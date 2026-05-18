import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SummaryGameDto } from './dto/summary-game.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly commonService: CommonService,
  ) {}

  create(createGameDto: CreateGameDto) {
    return this.gameRepository.save(createGameDto);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(this.gameRepository, paginationQueryDto, { transform: SummaryGameDto.fromEntity });
  }

  findOne(id: number) {
    return this.gameRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }
}
