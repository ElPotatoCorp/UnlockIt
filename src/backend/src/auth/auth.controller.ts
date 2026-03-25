import { Controller, Post, UseGuards, Request, Response, Body, Delete, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@User() user) {
    return user;
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user, @Response({ passthrough: true }) res) {
    const token = this.authService.login(user);

    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.HTTPS === 'true',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    return token;
  }
  
  @Public()
  @Post('logout')
  logout(@Request() req, @Response({ passthrough: true }) res) {
    res.clearCookie('jwt');
    return req.logout();
  }
}
