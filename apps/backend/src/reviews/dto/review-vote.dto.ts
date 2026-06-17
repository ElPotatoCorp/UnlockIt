import { ExactData, ReviewVote } from "@unlockit/shared";

export class ReviewVoteDto implements ReviewVote {
  helpful: boolean | null;
}

const _assertExact: ExactData<ReviewVote, ReviewVoteDto> = true;