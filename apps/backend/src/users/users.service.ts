import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUserDto } from '../user/dto/public-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';
import { EmployeeRole } from '@unlockit/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) {}

  async findPassword(
    identifier: string,
  ): Promise<{ id: string; password: string, permission: EmployeeRole | null } | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      relations: { employee: true },
      select: ['id', 'password', 'employee'],
    });

    return user ? { id: user.id, password: user.password, permission: (await user?.employee)?.role ?? null } : null;
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
