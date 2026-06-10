import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePasswordResetDto {
  @ApiProperty({
    description: 'It can either be an email or a username.',
    required: true,
  })
  @IsString()
  identifier: string;
}