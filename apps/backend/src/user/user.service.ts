import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from 'src/upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserBillingEntity } from './entities/user-billing.entity';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { UploadSubdir } from 'src/upload/upload.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserBillingEntity)
    private readonly userBillingRepository: Repository<UserBillingEntity>,
  ) {}

  async index(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  async getProfile(id: string) {
    return (await this.userProfileRepository.findOneBy({ userId: id })) ?? null;
  }

  async getBilling(id: string) {
    return (await this.userBillingRepository.findOneBy({ userId: id })) ?? null;
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  upsertProfile(id: string, profile: UpdateProfileDto) {
    return this.userProfileRepository.upsert(
      { userId: id, ...profile },
      { conflictPaths: ['userId'], skipUpdateIfNoValuesChanged: true },
    );
  }

  upsertBilling(id: string, billing: UpdateBillingDto) {
    return this.userBillingRepository.upsert(
      { userId: id, ...billing },
      { conflictPaths: ['userId'], skipUpdateIfNoValuesChanged: true },
    );
  }

  async updateAvatar(id: string, avatarFile: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'avatar'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    } else {
      user.avatar &&
        this.uploadService.removeObsoleteFile(
          UploadSubdir.AVATARS,
          user.avatar,
        ); // Remove old avatar if it exists
    }

    this.userRepository.update(id, { avatar: avatarFile.filename });

    return {
      message: 'Avatar updated successfully',
      avatar: avatarFile.filename,
    };
  }

  async deleteAvatar(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['avatar'],
    });

    if (user?.avatar) {
      this.uploadService.removeObsoleteFile(UploadSubdir.AVATARS, user.avatar); // Remove old avatar if it exists
      await this.userRepository.update(id, { avatar: null });
    }

    return { message: 'Avatar removed successfully' };
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }
}
