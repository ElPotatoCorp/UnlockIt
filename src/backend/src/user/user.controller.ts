import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { uploadUserAvatar } from 'src/upload/upload.constants';
import { User } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  index(@User('id') userId: string) {
    return this.userService.index(userId);
  }

  @Patch()
  update(
    @User('id') userId: string,
    @Body() partialUpdateUserDto?: Omit<UpdateUserDto, 'avatar'>, // Exclude avatar from DTO since it's handled separately
  ) {    
    return this.userService.update(userId, partialUpdateUserDto as UpdateUserDto);
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar', uploadUserAvatar.multerOptions))
  updateAvatar(
    @User('id') userId: string,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, avatarFile);
  }

  @Delete()
  delete(@User('id') userId: string, @Response({ passthrough: true }) res) {
    res.clearCookie('jwt');
    return this.userService.delete(userId);
  }
}
