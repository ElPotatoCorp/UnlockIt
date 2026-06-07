import { UserProfileEntity } from '../entities/user-profile.entity';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserProfileDto {
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

  public static fromEntity(entity: UserProfileEntity | null) {
    if (!entity) {
      return null;
    }

    const dto = new UserProfileDto();

    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.birthdate = entity.birthdate;
    dto.country = entity.country;
    dto.newsletter = entity.newsletter;

    return dto;
  }
}
