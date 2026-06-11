import { OmitType } from '@nestjs/swagger';
import {
  ExactData,
  GameType,
  SearchBody,
  SearchGameOptions,
  slugify,
} from '@unlockit/shared';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { SearchGameOptionsDtoDoc } from 'src/docs/games/dto/search-game-options.dto';

export class PriceFilterDto {
  @IsInt()
  @Min(0)
  min: number;

  @IsOptional()
  @IsInt()
  max?: number;
}

export class ReleaseFilterDto {
  @IsOptional()
  @IsEnum(['exact', 'before', 'after', 'coming-soon'])
  when?: 'exact' | 'before' | 'after' | 'coming-soon';

  @IsOptional()
  @Type(() => Date)
  date?: Date;
}

export class OrderOptionsDto {
  @IsEnum(['popular', 'price'])
  by: 'popular' | 'price';

  @IsOptional()
  @IsBoolean()
  asc?: boolean;
}

export class SearchGameOptionsDto implements SearchGameOptions {
  @SearchGameOptionsDtoDoc.Name()
  @Transform((params) => slugify(params.value))
  name: string;

  @SearchGameOptionsDtoDoc.Type()
  @IsOptional()
  @IsEnum(GameType)
  type?: GameType;

  @SearchGameOptionsDtoDoc.Price()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PriceFilterDto)
  price?: PriceFilterDto;

  @SearchGameOptionsDtoDoc.Release()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ReleaseFilterDto)
  release?: ReleaseFilterDto;

  @SearchGameOptionsDtoDoc.Order()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderOptionsDto)
  order: OrderOptionsDto;
}

export class SearchBodyDto
  extends OmitType(SearchGameOptionsDto, ['name'] as const)
  implements SearchBody {}

const _assertExact: ExactData<SearchGameOptions, SearchGameOptionsDto> = true;
const __assertExact: ExactData<SearchBody, SearchBodyDto> = true;
