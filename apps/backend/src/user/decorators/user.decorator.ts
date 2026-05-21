import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayloadDto = request.user;

    return data ? user?.[data] : user;
  },
);
