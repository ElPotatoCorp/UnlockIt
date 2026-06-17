import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsSlug } from 'src/common/validators/slug.validator';
import { Transform, Type } from 'class-transformer';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import {
  CreateGame,
  EUAgeRating,
  ExactData,
  GameType,
  LangCode,
} from '@unlockit/shared';
import { GameRelationsEntityDoc } from 'src/docs/games/entities/game-relations.entity.doc';
import { PartialGamePlatformDto } from 'src/platforms/dto/partial-game-platform.dto';

export class CreateGameDto implements CreateGame {
  @GamePrimitiveEntityDoc.Name()
  @IsString()
  @Length(2, 255)
  name: string;

  @GamePrimitiveEntityDoc.Slug()
  @IsSlug()
  @Length(2, 255)
  slug: string;

  @GamePrimitiveEntityDoc.Type()
  @IsEnum(GameType)
  type: GameType;

  @GamePrimitiveEntityDoc.Price()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @GamePrimitiveEntityDoc.AgeRating()
  @Type(() => Number)
  @IsEnum(EUAgeRating)
  ageRating: EUAgeRating;

  @GamePrimitiveEntityDoc.ReleaseDate()
  @IsDateString()
  releaseDate?: string;

  @GamePrimitiveEntityDoc.ComingSoon()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  comingSoon: boolean;

  @GamePrimitiveEntityDoc.HeaderImage()
  @IsUrl()
  @Length(0, 255)
  headerImage: string;

  @GamePrimitiveEntityDoc.CoverImage()
  @IsUrl()
  @Length(0, 255)
  coverImage: string;

  @GamePrimitiveEntityDoc.BackgroundImage()
  @IsUrl()
  @Length(0, 255)
  backgroundImage: string;

  @GamePrimitiveEntityDoc.ShortDescription()
  @IsString()
  @Length(10, 300)
  shortDescription: string;

  @GamePrimitiveEntityDoc.DetailedDescription()
  @IsString()
  @Length(10, 5000)
  detailedDescription: string;

  @GamePrimitiveEntityDoc.MetacriticScore()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  metacriticScore?: number;

  @GamePrimitiveEntityDoc.Website()
  @IsOptional()
  @IsUrl()
  website?: string;

  @GamePrimitiveEntityDoc.PcRequirements()
  @IsOptional()
  @IsString()
  @Length(10, 5000)
  pcRequirements?: string;

  @GamePrimitiveEntityDoc.SupportedLanguages()
  @IsOptional()
  @IsEnum(LangCode, { each: true })
  supportedLanguages?: LangCode[];

  @GameRelationsEntityDoc.Platforms()
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialGamePlatformDto)
  platforms?: PartialGamePlatformDto;
}

const _assertExact: ExactData<CreateGame, CreateGameDto> = true;
