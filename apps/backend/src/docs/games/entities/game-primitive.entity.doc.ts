import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { EUAgeRating, GameType, LangCode } from '@unlockit/shared';

export const GamePrimitiveEntityDoc = {
  // -------------------------------------------------------
  // Identity
  // -------------------------------------------------------

  Id: () =>
    applyDecorators(
      ApiProperty({
        title: 'Game ID',
        description: 'Unique identifier, auto-incremented by the system.',
        type: Number,
        example: 42,
        readOnly: true,
      }),
    ),

  Name: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description: 'Display name of the game.',
        type: String,
        minLength: 2,
        maxLength: 255,
        example: 'Call of Duty: Black Ops',
        required: required,
      }),
    ),

  Slug: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Slug',
        description:
          'URL-friendly unique identifier. Lowercase alphanumeric and hyphens only.',
        type: String,
        minLength: 2,
        maxLength: 255,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'call-of-duty-black-ops',
        required: required,
      }),
    ),

  Type: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Type',
        description: 'Whether this is a base game, DLC, or OST.',
        enum: GameType,
        enumName: 'GameType',
        example: GameType.GAME,
        default: GameType.GAME,
        required: required,
      }),
    ),

  // -------------------------------------------------------
  // Pricing
  // -------------------------------------------------------

  Price: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Price',
        description: 'Base price in euros. Must be non-negative.',
        type: Number,
        format: 'decimal',
        minimum: 0,
        example: 59.99,
        required: required,
      }),
    ),

  // -------------------------------------------------------
  // Classification
  // -------------------------------------------------------

  AgeRating: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Age rating',
        description: 'PEGI age rating.',
        enum: EUAgeRating,
        enumName: 'EUAgeRating',
        example: EUAgeRating.EIGHTEEN,
        default: EUAgeRating.EIGHTEEN,
        required: required,
      }),
    ),

  MetacriticScore: () =>
    applyDecorators(
      ApiProperty({
        title: 'Metacritic score',
        description: 'Metacritic score from 0 to 100. Null if not yet rated.',
        type: Number,
        minimum: 0,
        maximum: 100,
        example: 87,
        required: false,
        nullable: true,
      }),
    ),

  SupportedLanguages: () =>
    applyDecorators(
      ApiProperty({
        title: 'Supported languages',
        description: 'List of ISO 639-1 language codes supported by the game.',
        enum: LangCode,
        enumName: 'LangCode',
        isArray: true,
        example: [LangCode.EN, LangCode.FR, LangCode.DE],
        required: false,
        nullable: true,
      }),
    ),

  // -------------------------------------------------------
  // Release
  // -------------------------------------------------------

  ReleaseDate: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Release date',
        description:
          'ISO 8601 date string. Can be in the future if comingSoon is true.',
        type: String,
        format: 'date',
        example: '2024-11-15',
        required: required,
        nullable: true,
      }),
    ),

  ComingSoon: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Coming soon',
        description:
          'Whether the game is not yet released and unavailable for purchase.',
        type: Boolean,
        example: false,
        default: false,
        required: required,
      }),
    ),

  // -------------------------------------------------------
  // Media - stored filenames, not URLs
  // -------------------------------------------------------

  HeaderImage: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Header image',
        description:
          'URL of the header image. Displayed in listings and search results.',
        type: String,
        format: 'uri',
        maxLength: 255,
        example: 'https://cdn.unlockit.com/images/3f2a1c4d-header.jpg',
        required: required,
      }),
    ),

  CoverImage: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Cover image',
        description: 'URL of the of the cover/box-art image.',
        type: String,
        format: 'uri',
        maxLength: 255,
        example: 'https://cdn.unlockit.com/images/3f2a1c4d-cover.jpg',
        required: required,
      }),
    ),

  BackgroundImage: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Background image',
        description:
          'URL of the background image displayed on the game detail page.',
        type: String,
        format: 'uri',
        maxLength: 255,
        example: 'https://cdn.unlockit.com/images/3f2a1c4d-background.jpg',
        required: required,
      }),
    ),

  // -------------------------------------------------------
  // Descriptions
  // -------------------------------------------------------

  ShortDescription: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Short description',
        description: 'Brief summary shown in listings. 10-300 characters.',
        type: String,
        minLength: 10,
        maxLength: 300,
        example: 'Experience the most thrilling Black Ops chapter yet.',
        required: required,
      }),
    ),

  DetailedDescription: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Detailed description',
        description:
          'Full description shown on the game detail page. Supports plain text. 10-5000 characters.',
        type: String,
        minLength: 10,
        maxLength: 5000,
        example: 'Black Ops returns with a gripping storyline...',
        required: required,
      }),
    ),

  Website: () =>
    applyDecorators(
      ApiProperty({
        title: 'Official website',
        description: 'URL of the official game or publisher website.',
        type: String,
        format: 'uri',
        maxLength: 255,
        example: 'https://www.callofduty.com',
        required: false,
        nullable: true,
      }),
    ),

  PcRequirements: () =>
    applyDecorators(
      ApiProperty({
        title: 'PC requirements',
        description:
          'Plain text or structured description of minimum and recommended PC specifications.',
        type: String,
        minLength: 10,
        maxLength: 5000,
        example: 'Minimum: OS: Windows 10, CPU: Intel i5-6600K...',
        required: false,
        nullable: true,
      }),
    ),
};
