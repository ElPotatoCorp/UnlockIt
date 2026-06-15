import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ExactData, UserProfile } from '@unlockit/shared';

export class UserProfileDto implements UserProfile {
  @UserEntityDoc.FirstName()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName: string | null;

  @UserEntityDoc.LastName()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName: string | null;

  @UserEntityDoc.Birthdate()
  @IsOptional()
  @IsDateString()
  birthdate: string | null;

  @UserEntityDoc.Country()
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  country: string | null;

  @UserEntityDoc.Newsletter()
  @IsOptional()
  @IsBoolean()
  newsletter: boolean;
}

const _assertExact: ExactData<UserProfile, UserProfileDto> = true;
