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
} from 'class-validator';
import { IsSlug } from 'src/common/validators/slug.validator';
import { Transform, Type } from 'class-transformer';
import { GameEntityDoc } from 'src/docs/games/entities/game.entity.doc';
import { CreateGame, EUAgeRating, GameType, LangCode } from '@unlockit/shared';

export class CreateGameDto implements CreateGame {
  @GameEntityDoc.Name()
  @IsString()
  @Length(2, 255)
  name: string;

  @GameEntityDoc.Slug()
  @IsSlug()
  @Length(2, 255)
  slug: string;

  @GameEntityDoc.Type()
  @IsEnum(GameType)
  type: GameType;

  @GameEntityDoc.Price()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @GameEntityDoc.AgeRating()
  @Type(() => Number)
  @IsEnum(EUAgeRating)
  ageRating: EUAgeRating;

  @GameEntityDoc.ReleaseDate()
  @IsDateString()
  releaseDate?: string;

  @GameEntityDoc.ComingSoon()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  comingSoon: boolean;

  @GameEntityDoc.HeaderImage()
  @IsUrl()
  @Length(0, 255)
  headerImage: string;

  @GameEntityDoc.CoverImage()
  @IsUrl()
  @Length(0, 255)
  coverImage: string;

  @GameEntityDoc.BackgroundImage()
  @IsUrl()
  @Length(0, 255)
  backgroundImage: string;

  @GameEntityDoc.ShortDescription()
  @IsString()
  @Length(10, 300)
  shortDescription: string;

  @GameEntityDoc.DetailedDescription()
  @IsString()
  @Length(10, 5000)
  detailedDescription: string;

  @GameEntityDoc.MetacriticScore()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  metacriticScore?: number;

  @GameEntityDoc.Website()
  @IsOptional()
  @IsUrl()
  website?: string;

  @GameEntityDoc.PcRequirements()
  @IsOptional()
  @IsString()
  @Length(10, 5000)
  pcRequirements?: string;

  @GameEntityDoc.SupportedLanguages()
  @IsOptional()
  @IsEnum(LangCode, { each: true })
  supportedLanguages?: LangCode[];
}
