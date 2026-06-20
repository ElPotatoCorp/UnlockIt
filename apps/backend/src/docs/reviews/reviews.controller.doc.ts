import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiAuth } from "../auth/decorators/api-auth.decorator";
import { ReviewVoteDto } from "src/reviews/dto/review-vote.dto";

export const ReviewsControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Series')),

  Vote: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Vote for a review.' }),
    ApiBody({ type: ReviewVoteDto }),
    ApiParam({
      name: 'id',
      required: true,
      type: String,
      description: 'UUID of the review to retrieve',
      example: '08dbd076-c3d8-46d4-bb0d-ebedc8bebd1f',
    }),
  ),
}