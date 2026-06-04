import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(
    identifier: string,
    password: string,
  ): Promise<Pick<JwtPayloadDto, 'sub' | 'permission'>> {
    const user = await this.authService.validateUser(identifier, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return { sub: user.id, permission: user.permission }; // Return an object with a 'sub' property for JWT payload
  }
}
