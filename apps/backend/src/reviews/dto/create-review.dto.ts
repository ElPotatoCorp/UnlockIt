import { CreateReview, ExactData } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';
import { ReviewEntityDoc } from 'src/docs/reviews/entities/review.entity.doc';

export class CreateReviewDto implements CreateReview {
  @ReviewEntityDoc.Content()
  @IsString()
  @Length(20, 10000)
  content: string;

  @ReviewEntityDoc.Rate()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  rate: number;
}

const _assertExact: ExactData<CreateReview, CreateReviewDto> = true;
