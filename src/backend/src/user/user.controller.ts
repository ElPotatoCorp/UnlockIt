import { Controller, Get, Body, Patch, Delete, Response, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { uploadUserAvatar } from 'src/upload/upload.constants';
import { User } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserControllerDoc } from 'src/docs/user/user.controller.doc';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserBillingDto } from './dto/user-billing.dto';
import jwtConfig from 'src/config/jwt.config';
import { type ConfigType } from '@nestjs/config';

@UserControllerDoc.Controller()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  @UserControllerDoc.Index()
  @Get()
  async index(@User('sub') userId: string) {
    return UserDto.fromEntity(await this.userService.index(userId));
  }

  @UserControllerDoc.GetProfile()
  @Get('profile')
  async getProfile(@User('sub') userId: string) {
    return UserProfileDto.fromEntity(await this.userService.getProfile(userId));
  }

  @UserControllerDoc.GetBilling()
  @Get('billing')
  async getBilling(@User('sub') userId: string) {
    return UserBillingDto.fromEntity(await this.userService.getBilling(userId));
  }

  @UserControllerDoc.Patch()
  @Patch()
  update(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {    
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
    @User('sub') userId: string,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, avatarFile);
  }

  @UserControllerDoc.DeleteAvatar()
  @Delete('avatar')
  deleteAvatar(@User('sub') userId: string) {
    return this.userService.deleteAvatar(userId);
  }

  @UserControllerDoc.Delete()
  @Delete()
  delete(@User('sub') userId: string, @Response({ passthrough: true }) res) {
    res.clearCookie(this.jwt.accessTokenCookieName);
    res.clearCookie(this.jwt.refreshTokenCookieName);

    return this.userService.delete(userId);
  }
}
