import { PartialType } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';
import { ExactData, UpdateProfile } from '@unlockit/shared';

export class UpdateProfileDto extends PartialType(UserProfileDto) implements UpdateProfile {}

const _assertExact: ExactData<UpdateProfile, UpdateProfileDto> = true;
