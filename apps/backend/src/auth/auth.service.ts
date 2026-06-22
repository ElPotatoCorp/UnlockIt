import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt-ts';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { createHash } from 'crypto';
import { CreateJwtPayloadDto } from './dto/jwt-payload.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TicketEntity } from 'src/tickets/entities/ticket.entity';
import { hashPassword } from 'src/user/entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly reviewRepository: Repository<TicketEntity>,
    private readonly userService: UserService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly commonService: CommonService,
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(identifier: string, pass: string) {
    const user = await this.usersService.findPassword(identifier);
    if (user && (await compare(pass, user.password))) {
      return user;
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
      session && (await this.sessionsService.deleteExpired(session));
      throw new UnauthorizedException('Invalid or expired session');
    }

    return session;
  }

  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(
    user: CreateJwtPayloadDto,
    ip: string,
    userAgent: string,
    sessionId?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: this.jwt.refreshTokenExpiresIn,
    });

    const session = (
      await this.sessionsService.createOrUpdate({
        id: sessionId,
        userId: user.sub,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        ipAddress: ip,
        userAgent: userAgent,
      })
    ).identifiers[0].id;

    const payload = {
      sid: session,
      ...user,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.jwt.accessTokenExpiresIn,
      }),
      refreshToken: refreshToken,
    };
  }

  async resetPassword(ticketId: string, resetPasswordDto: ResetPasswordDto) {
    const fifteenMinutesLater = new Date();
    fifteenMinutesLater.setMinutes(fifteenMinutesLater.getMinutes() + 15);

    const ticket = await this.commonService.entities.fetchEntityOrFail(
      this.reviewRepository,
      {
        where: {
          id: ticketId,
          createdAt: LessThan(fifteenMinutesLater),
        },
      },
    );

    const user = await this.usersService.findOne({ email: ticket.email });

    if (!user) {
      throw new UnprocessableEntityException(
        'This user does not seem to exists',
      );
    }

    this.userService.update(user.id, {
      password: await hashPassword(resetPasswordDto.password),
    });
  }

  logout(sessionId: string) {
    return this.sessionsService.delete(sessionId);
  }
}
