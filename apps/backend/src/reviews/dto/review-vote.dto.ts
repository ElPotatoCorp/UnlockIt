import { ApiProperty } from "@nestjs/swagger";
import { ExactData, ReviewVote } from "@unlockit/shared";

export class ReviewVoteDto implements ReviewVote {
  @ApiProperty({
    title: 'Helpful',
    description: 'Vote for a review if it is helpful or not. If is `null`, it cancels the vote and will be removed later.',
    type: Boolean,
    example: true,
  })
  helpful: boolean | null;
}

const _assertExact: ExactData<ReviewVote, ReviewVoteDto> = true;