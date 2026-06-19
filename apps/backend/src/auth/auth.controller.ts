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
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/decorators/user.decorator';
import { AuthControllerDoc } from 'src/docs/auth/auth.controller.doc';
import { CreateJwtPayloadDto, JwtPayloadDto } from './dto/jwt-payload.dto';
import { UserAgent } from './decorators/user-agent.decorator';
import { type ConfigType } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import jwtConfig from '../config/jwt.config';
import { DuplicatedEntryPipe } from 'src/common/entities/pipes/duplicated-entry.pipe';
import { UserEntity } from 'src/user/entities/user.entity';
import { TicketsService } from 'src/tickets/tickets.service';
import { CreatePasswordResetDto } from 'src/auth/dto/create-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EntityFetchPipe } from 'src/common/entities/pipes/fetch-entity.pipe';
import { TicketEntity } from 'src/tickets/entities/ticket.entity';
import coreConfig from 'src/config/core.config';
import { UserMapper } from 'src/user/user.mapper';

@AuthControllerDoc.Controller()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ticketService: TicketsService,
    @Inject(coreConfig.KEY) private readonly config: ConfigType<typeof coreConfig>,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const isHttps = this.config.https;

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
  async register(
    @Body(DuplicatedEntryPipe(UserEntity, 'email', 'username'))
    createUserDto: CreateUserDto,
  ) {
    return UserMapper.toUser(await this.authService.register(createUserDto));
  }

  @AuthControllerDoc.Login()
  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Throttle({ authLogin: {} })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @User() user: CreateJwtPayloadDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Response({ passthrough: true }) res,
  ) {
    const tokens = await this.authService.login(user, ip, userAgent);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  }

  @Public()
  @Throttle({ authResetPassword: {} })
  @Post('forgotten-password')
  @HttpCode(HttpStatus.OK)
  forgottenPassword(@Body() createPasswordResetDto: CreatePasswordResetDto) {
    // In practice, the ticket id should not be returned
    // However, in this case, because we are in dev with no mailing system, we do that way
    return this.ticketService.createPasswordResetTicket(createPasswordResetDto);
  }

  @Public()
  @Throttle({ authResetPassword: {} })
  @Post('reset-password/:ticketId')
  resetPassword(
    @Param('ticketId', new ParseUUIDPipe({ version: '4' }), EntityFetchPipe(TicketEntity)) ticket: TicketEntity,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(ticket, resetPasswordDto);
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
    const { sid, iat, exp, ...createJwtPayloadDto } = session;

    const tokens = await this.authService.login(
      createJwtPayloadDto as CreateJwtPayloadDto,
      ip,
      userAgent,
      sid,
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
