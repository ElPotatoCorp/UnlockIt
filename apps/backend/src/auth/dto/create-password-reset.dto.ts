import { ApiProperty } from "@nestjs/swagger";
import { CreatePasswordReset, ExactData } from "@unlockit/shared";
import { IsString } from "class-validator";

export class CreatePasswordResetDto implements CreatePasswordReset {
  @ApiProperty({
    description: 'It can either be an email or a username.',
    required: true,
  })
  @IsString()
  identifier: string;
}

const _assertExact: ExactData<CreatePasswordReset, CreatePasswordResetDto> = true;