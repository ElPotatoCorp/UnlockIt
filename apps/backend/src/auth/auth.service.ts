import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt-ts';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(identifier: string, pass: string) {
    const user = await this.usersService.findPassword(identifier);
    if (user && await compare(pass, user.password)) {
      return user.id;
    }
    return null;
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  async refreshAccessToken(refreshToken: string, userId: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const session = await this.sessionsService.findByUserAndRefreshTokenHash(
      userId,
      refreshTokenHash,
    );

    if (!session || this.sessionsService.isExpired(session)) {
      session && await this.sessionsService.deleteExpired(session);
      throw new UnauthorizedException('Invalid or expired session');
    }

    return session;
  }

  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(userId: string, ip: string, userAgent: string, sessionId?: string): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: this.jwt.refreshTokenExpiresIn });

    const session = (
      await this.sessionsService.createOrUpdate({
        id: sessionId,
        userId: userId,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        ipAddress: ip,
        userAgent: userAgent,
      })
    ).identifiers[0].id;

    const payload = { sub: userId, sid: session };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: this.jwt.accessTokenExpiresIn }),
      refreshToken: refreshToken,
    };
  }

  logout(sessionId: string) {
    return this.sessionsService.delete(sessionId);
  }
}
