import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { ExactData, UpdateGame } from '@unlockit/shared';

export class UpdateGameDto
  extends PartialType(CreateGameDto)
  implements UpdateGame {}

const _assertExact: ExactData<UpdateGame, UpdateGameDto> = true;
