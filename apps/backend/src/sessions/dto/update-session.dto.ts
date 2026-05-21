import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSessionDto extends PartialType(
  OmitType(CreateSessionDto, ['id', 'userId', 'expiresAt'] as const),
) {
  @IsOptional()
  @IsBoolean()
  flagged?: boolean;
}
