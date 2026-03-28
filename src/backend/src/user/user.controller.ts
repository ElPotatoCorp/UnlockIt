import { Controller, Get, Body, Patch, Delete, Response, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { uploadUserAvatar } from 'src/upload/upload.constants';
import { User } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserControllerDoc } from 'src/docs/user/user.controller.doc';

@UserControllerDoc.Controller()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UserControllerDoc.Index()
  @Get()
  index(@User('sub') userId: string) {
    console.log(`Fetching profile for user ID: ${userId}`);
    return this.userService.index(userId);
  }

  @UserControllerDoc.Patch()
  @Patch()
  update(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {    
    return this.userService.update(userId, updateUserDto);
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

  @UserControllerDoc.Delete()
  @Delete()
  delete(@User('sub') userId: string, @Response({ passthrough: true }) res) {
    res.clearCookie('jwt');
    return this.userService.delete(userId);
  }
}
