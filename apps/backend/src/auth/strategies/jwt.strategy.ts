import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../../config/jwt.config';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[jwt.accessTokenCookieName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto> {
    return payload;
  }
}
