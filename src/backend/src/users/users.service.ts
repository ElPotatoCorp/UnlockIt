import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUser } from '../user/entities/public-user.entity';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async findAll(page: number, limit: number) {
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;
    
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedDto(users.map(user => PublicUser.fromUser(user)), total, page, limit);
  }

  findOne(where: FindOptionsWhere<User>, includeSensitive = false) {
    return this.userRepository.findOneBy(where).then(user => {
      if (!user) {
        throw new NotFoundException(`User not found with criteria: ${JSON.stringify(where)}`);
      }
      if (includeSensitive) {
        return user;
      }
      return PublicUser.fromUser(user);
    });
  }
}
