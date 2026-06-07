import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const MediaEntityDoc = {
  Id: () =>
    applyDecorators(
      ApiProperty({
        title: 'Media ID',
        type: Number,
        example: 1,
        readOnly: true,
      }),
    ),

  GameId: () =>
    applyDecorators(
      ApiProperty({
        title: 'Game ID',
        description: 'ID of the game this media belongs to.',
        type: Number,
        example: 42,
      }),
    ),

  Url: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'URL',
        description:
          'Absolute URL to the media resource. Must start with http:// or https://.',
        type: String,
        format: 'uri',
        maxLength: 255,
        example: 'https://cdn.unlockit.com/media/black-ops-trailer.mp4',
        required: required,
      }),
    ),

  Type: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Type',
        description: 'Whether this is a video or an image.',
        enum: ['video', 'image'],
        example: 'video',
        required: required,
        nullable: true,
      }),
    ),
};
