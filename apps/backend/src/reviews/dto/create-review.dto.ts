import { CreateReview, ExactData } from "@unlockit/shared";
import { Type } from "class-transformer";
import { IsInt, IsString, Length } from "class-validator";

export class CreateReviewDto implements CreateReview {
  @IsString()
  @Length(20, 10000)
  content: string;

  @IsInt()
  @Length(0, 10)
  @Type(() => Number)
  score: number;
}

const _assertExact: ExactData<CreateReview, CreateReviewDto> = true;