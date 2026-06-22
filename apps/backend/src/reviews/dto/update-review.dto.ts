import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { ExactData, UpdateReview } from '@unlockit/shared';

export class UpdateReviewDto
  extends PartialType(CreateReviewDto)
  implements UpdateReview {}

const _assertExact: ExactData<UpdateReview, UpdateReviewDto> = true;
