import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import jwtConfig from 'src/config/jwt.config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies?.[this.jwt.refreshTokenCookieName],
      ]),
      secretOrKey: jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayloadDto) {
    const refreshToken = request.cookies?.[this.jwt.refreshTokenCookieName];
    const session = await this.authService.refreshAccessToken(
      refreshToken,
      payload.sub,
    );

    return { sub: session.userId, sid: session.id, permission: payload.permission };
  }
}
