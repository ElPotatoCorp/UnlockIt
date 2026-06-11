import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ExactData, UpdateSession } from '@unlockit/shared';

export class UpdateSessionDto extends PartialType(
  OmitType(CreateSessionDto, ['id', 'userId', 'expiresAt'] as const),
) implements UpdateSession {
  @IsOptional()
  @IsBoolean()
  flagged?: boolean;
}

const _assertExact: ExactData<UpdateSession, UpdateSessionDto> = true;