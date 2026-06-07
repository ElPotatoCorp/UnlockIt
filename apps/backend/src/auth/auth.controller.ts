import {
  Controller,
  Post,
  UseGuards,
  Response,
  Body,
  Get,
  HttpCode,
  Ip,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/decorators/user.decorator';
import { AuthControllerDoc } from 'src/docs/auth/auth.controller.doc';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { UserAgent } from './decorators/user-agent.decorator';
import { ConfigService, type ConfigType } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { EmployeeRole } from '@unlockit/shared';
import jwtConfig from '../config/jwt.config';
import { DuplicatedEntryPipe } from 'src/common/pipes/duplicated-entry.pipe';
import { UserEntity } from 'src/user/entities/user.entity';

@AuthControllerDoc.Controller()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const isHttps = this.config.get('HTTPS', 'false') === 'true';

    res.cookie(this.jwt.accessTokenCookieName, accessToken, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
      maxAge: this.jwt.accessTokenExpiresIn,
    });
    res.cookie(this.jwt.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
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
  @UseGuards(ThrottlerGuard)
  @Throttle({ authRegister: {} })
  @Post('register')
  register(
    @Body(DuplicatedEntryPipe(UserEntity, ['email', 'username']))
    createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto);
  }

  @AuthControllerDoc.Login()
  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Throttle({ authLogin: {} })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @User() user: { sub: string; permission: EmployeeRole | null },
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Response({ passthrough: true }) res,
  ) {
    const tokens = await this.authService.login(
      { userId: user.sub, permission: user.permission },
      ip,
      userAgent,
    );
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  }

  @AuthControllerDoc.Refresh()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @User() session: JwtPayloadDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Response({ passthrough: true }) res,
  ) {
    const tokens = await this.authService.login(
      { userId: session.sub, permission: session.permission },
      ip,
      userAgent,
      session.sid,
    );
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  }

  @AuthControllerDoc.Logout()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@User('sid') sessionId: string, @Response({ passthrough: true }) res) {
    this.authService.logout(sessionId);

    res.clearCookie(this.jwt.accessTokenCookieName);
    res.clearCookie(this.jwt.refreshTokenCookieName);
  }
}
