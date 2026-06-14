import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { GameDeveloperDto } from 'src/developers/dto/game-developer.dto';
import { MediaDto } from 'src/media/dto/media.dto';
import { GamePlatformDto } from 'src/platforms/dto/game-platform.dto';
import { GamePublisherDto } from 'src/publishers/dto/game-publisher.dto';
import { SeriesDto } from 'src/series/dto/series.dto';
import { GameTagDto } from 'src/tags/dto/game-tag.dto';

export const GameRelationsEntityDoc = {
  Tags: () =>
    applyDecorators(
      ApiProperty({
        title: 'Tags',
        description: 'List of game tags.',
        type: GameTagDto,
        isArray: true,
        required: true,
      }),
    ),

  Developers: () =>
    applyDecorators(
      ApiProperty({
        title: 'Developers',
        description: 'List of game developers.',
        type: GameDeveloperDto,
        isArray: true,
        required: true,
      }),
    ),

  Publishers: () =>
    applyDecorators(
      ApiProperty({
        title: 'Publishers',
        description: 'List of game publishers.',
        type: GamePublisherDto,
        isArray: true,
        required: true,
      }),
    ),

  Platforms: () =>
    applyDecorators(
      ApiProperty({
        title: 'Platforms',
        description: 'List of game platforms.',
        type: GamePlatformDto,
        required: false,
      }),
    ),

  Media: () =>
    applyDecorators(
      ApiProperty({
        title: 'Media',
        description: 'List of game media.',
        type: MediaDto,
        isArray: true,
        required: true,
      }),
    ),

  Series: () =>
    applyDecorators(
      ApiProperty({
        title: 'Series',
        description: 'Series the game is from.',
        type: SeriesDto,
        required: false,
      }),
    ),
};
