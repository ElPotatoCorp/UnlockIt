import { Controller, Post, UseGuards, Response, Body, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/decorators/user.decorator';
import { AuthControllerDoc } from 'src/docs/auth/auth.controller.doc';
import { JwtPayloadDto } from './dto/jwt-payload.interface';
import { User as UserEntity } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthControllerDoc.Me()
  @Get('me')
  me(@User() user: JwtPayloadDto) {
    return user;
  }

  @AuthControllerDoc.Register()
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @AuthControllerDoc.Login()
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserEntity, @Response({ passthrough: true }) res) {
    const token = this.authService.login(user);

    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.HTTPS === 'true',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return token;
  }
  
  @AuthControllerDoc.Logout()
  @Public()
  @Post('logout')
  @HttpCode(204)
  logout(@Response({ passthrough: true }) res) {
    res.clearCookie('jwt');
  }
}
