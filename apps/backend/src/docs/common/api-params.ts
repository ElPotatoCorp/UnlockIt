import { ApiParam } from '@nestjs/swagger';

export const GAME_ID_PARAM = ApiParam({
  name: 'gameId',
  type: Number,
  description: 'Numeric ID of the game.',
  example: 42,
});