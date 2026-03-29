import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt-ts';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string) {
    const user = await this.usersService.findPassword(identifier);
    if (user && compareSync(pass, user.password)) {
      return user.id;
    }
    return null;
  }

  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  login(userId: string) {
    const payload = { sub: userId, sid: null }; // TODO: Add session management for sid
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
