import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUserDto } from '../user/dto/public-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) {}

  findPassword(
    identifier: string,
  ): Promise<{ id: string; password: string } | null> {
    return this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: ['id', 'password'],
    });
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.userRepository,
      paginationQueryDto,
      { transform: PublicUserDto.fromEntity },
    );
  }

  findOne(where: FindOptionsWhere<User>, includeSensitive = false) {
    return this.userRepository.findOneBy(where).then((user) => {
      if (!user) {
        return null;
      }
      if (includeSensitive) {
        return user;
      }
      return user;
    });
  }
}
