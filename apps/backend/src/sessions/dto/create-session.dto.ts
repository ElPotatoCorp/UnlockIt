import {
  IsDateString,
  IsHash,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsUUID(4)
  id?: string;

  @IsUUID(4)
  userId: string;

  @IsString()
  @IsHash('sha256')
  refreshTokenHash: string;

  @IsString()
  @IsIP(4)
  ipAddress: string;

  @IsString()
  userAgent: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}
