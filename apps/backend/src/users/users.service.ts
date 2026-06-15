import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUserDto } from '../user/dto/public-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';
import { CreateJwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { UserMapper } from 'src/user/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly commonService: CommonService,
  ) {}

  async findPassword(identifier: string): Promise<{
    password: string;
    createJwtPayloadDto: CreateJwtPayloadDto;
  } | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: { id: true, password: true, employee: true },
      relations: { employee: true },
    });

    return user
      ? {
          password: user.password,
          createJwtPayloadDto: {
            sub: user.id,
            cartId: (await user.cart)?.id,
            permission: (await user.employee)?.role ?? null,
          },
        }
      : null;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.userRepository,
      paginationQueryDto,
      { transform: { fn: UserMapper.toPublic } },
    );
  }

  async findOne(where: FindOptionsWhere<UserEntity>) {
    return this.userRepository.findOneBy(where);
  }
}
