import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublicUser } from '../user/entities/public-user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async findAll(limit = 10, offset = 0) {
    const [result, total] = await this.userRepository.findAndCount(
      {
        take: limit,
        skip: offset
      }
    );

    return {
      users: result.map(user => user as PublicUser),
      count: total,
      offset: offset,
      limit: limit
    }
  }

  findOne(where: FindOptionsWhere<User>, includeSensitive = false) {
    return this.userRepository.findOneBy(where).then(user => {
      if (!user) {
        return null;
      }
      if (includeSensitive) {
        return user;
      }
      return user as PublicUser;
    });
  }
}
