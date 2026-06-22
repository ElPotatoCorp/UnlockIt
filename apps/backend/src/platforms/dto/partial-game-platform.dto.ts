import { PartialType } from '@nestjs/swagger';
import { GamePlatformDto } from './game-platform.dto';

export class PartialGamePlatformDto extends PartialType(GamePlatformDto) {}
