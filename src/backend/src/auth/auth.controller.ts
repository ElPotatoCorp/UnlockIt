import { Controller, Post, UseGuards, Response, Body, Get, HttpCode, Ip, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/decorators/user.decorator';
import { AuthControllerDoc } from 'src/docs/auth/auth.controller.doc';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { UserAgent } from './decorators/user-agent.decorator';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    res.cookie(this.jwt.accessTokenCookieName, accessToken, {
      httpOnly: true,
      secure: process.env.HTTPS === 'true',
      sameSite: 'strict',
      maxAge: this.jwt.accessTokenExpiresIn,
    })
    res.cookie(this.jwt.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS === 'true',
      sameSite: 'strict',
      maxAge: this.jwt.refreshTokenExpiresIn,
    });
  }

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
  @HttpCode(200)
  async login(@User('sub') userId: string, @Ip() ip: string, @UserAgent() userAgent: string, @Response({ passthrough: true }) res) {
    const tokens = await this.authService.login(userId, ip, userAgent);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  // @AuthControllerDoc.Refresh() // TODO: Add documentation for this endpoint
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@User() session: JwtPayloadDto, @Ip() ip: string, @UserAgent() userAgent: string, @Response({ passthrough: true }) res) {
    const tokens = await this.authService.login(session.sub, ip, userAgent, session.sid);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }
  
  @AuthControllerDoc.Logout()
  @Post('logout')
  @HttpCode(204)
  logout(@User('sid') sessionId: string, @Response({ passthrough: true }) res) {
    this.authService.logout(sessionId);
    
    res.clearCookie(this.jwt.accessTokenCookieName);
    res.clearCookie(this.jwt.refreshTokenCookieName);
  }
}
