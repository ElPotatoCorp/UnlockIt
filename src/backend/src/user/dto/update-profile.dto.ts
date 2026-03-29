import { PartialType } from "@nestjs/swagger";
import { UserProfileDto } from "./user-profile.dto";

export class UpdateProfileDto extends PartialType(UserProfileDto) {}