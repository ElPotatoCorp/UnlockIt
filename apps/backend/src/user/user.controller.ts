import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Response,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { uploadUserAvatar } from 'src/upload/upload.constants';
import { User } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserControllerDoc } from 'src/docs/user/user.controller.doc';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import jwtConfig from 'src/config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { EntityFetchPipe } from 'src/common/entities/pipes/fetch-entity.pipe';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserBillingEntity } from './entities/user-billing.entity';
import { EntityExistsPipe } from 'src/common/entities/pipes/entity-exists.pipe';

@UserControllerDoc.Controller()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  @UserControllerDoc.Index()
  @Get()
  async index(@User('sub', EntityFetchPipe(UserEntity)) user: UserEntity) {
    return this.userService.findOne(user);
  }

  @UserControllerDoc.GetProfile()
  @Get('profile')
  async getProfile(@User('sub', EntityFetchPipe(UserProfileEntity, 'userId')) userProfile: UserProfileEntity) {
    return UserMapper.toProfile(userProfile);
  }

  @UserControllerDoc.GetBilling()
  @Get('billing')
  async getBilling(@User('sub', EntityFetchPipe(UserBillingEntity, 'userId')) userBilling: UserBillingEntity) {
    return UserMapper.toBilling(userBilling);
  }

  @UserControllerDoc.Patch()
  @Patch()
  update(@User('sub') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @UserControllerDoc.UpsertProfile()
  @Patch('profile')
  upsertProfile(
    @User('sub') userId: string,
    @Body() profile: UpdateProfileDto,
  ) {
    return this.userService.upsertProfile(userId, profile);
  }

  @UserControllerDoc.UpsertBilling()
  @Patch('billing')
  upsertBilling(
    @User('sub') userId: string,
    @Body() billing: UpdateBillingDto,
  ) {
    return this.userService.upsertBilling(userId, billing);
  }

  @UserControllerDoc.UpdateAvatar()
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar', uploadUserAvatar.multerOptions))
  updateAvatar(
    @User('sub', EntityFetchPipe(UserEntity, 'id', { select: { id: true, avatar: true } })) user: UserEntity,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(user, avatarFile);
  }

  @UserControllerDoc.DeleteAvatar()
  @Delete('avatar')
  deleteAvatar(@User('sub', EntityFetchPipe(UserEntity, 'id', { select: { id: true, avatar: true } })) user: UserEntity) {
    return this.userService.deleteAvatar(user);
  }

  @UserControllerDoc.Delete()
  @Delete()
  delete(@User('sub', EntityExistsPipe(UserEntity)) userId: string, @Response({ passthrough: true }) res) {
    res.clearCookie(this.jwt.accessTokenCookieName);
    res.clearCookie(this.jwt.refreshTokenCookieName);

    return this.userService.delete(userId);
  }
}
