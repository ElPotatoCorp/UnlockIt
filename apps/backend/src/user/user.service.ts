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
import { CartEntity } from 'src/cart/entities/cart.entity';
import { UserDto } from './dto/user.dto';

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
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async findOne(user: UserEntity) {
    return UserDto.fromEntity(user);
  }

  async getProfile(id: string) {
    return this.userProfileRepository.findOneBy({ userId: id });
  }

  async getBilling(id: string) {
    return this.userBillingRepository.findOneBy({ userId: id });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user).then(async (userEntity) => {
      const cart = this.cartRepository.create({ userId: userEntity.id });
      await this.cartRepository.save(cart);
      return userEntity;
    });
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

  async updateAvatar(user: UserEntity, avatarFile: Express.Multer.File) {
    user.avatar &&
      this.uploadService.removeObsoleteFile(
        UploadSubdir.AVATARS,
        user.avatar,
      ); // Remove old avatar if it exists

    this.userRepository.update(user.id, { avatar: avatarFile.filename });

    return {
      message: 'Avatar updated successfully',
      avatar: avatarFile.filename,
    };
  }

  async deleteAvatar(user: UserEntity) {

    if (user?.avatar) {
      this.uploadService.removeObsoleteFile(UploadSubdir.AVATARS, user.avatar); // Remove old avatar if it exists
      await this.userRepository.update(user.id, { avatar: null });
    }

    return { message: 'Avatar removed successfully' };
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }
}
