import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from 'src/upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async index(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async updateAvatar(id: string, avatarFile: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    else {
      user?.avatar && this.uploadService.removeObsoleteFile(user?.avatar); // Remove old avatar if it exists
    }
    
    this.userRepository.update(id, { avatar: avatarFile.filename });

    return {
      message: 'Avatar updated successfully',
      avatar: avatarFile.filename,
    };
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }
}
