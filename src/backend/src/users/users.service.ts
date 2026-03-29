import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUserDto } from '../user/dto/public-user.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  findPassword(identifier: string): Promise<{ id: string; password: string } | null> {
    return this.userRepository.findOne({
      where: [
        { email: identifier },
        { username: identifier },
      ],
      select: ['id', 'password'],
    })
  }

  async findAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedDto(total, page, limit, users.map(user => PublicUserDto.fromEntity(user)));
  }

  findOne(where: FindOptionsWhere<User>, includeSensitive = false) {
    return this.userRepository.findOneBy(where).then(user => {
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
