import { CreateSeries, ExactData } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';

export class CreateSeriesDto implements CreateSeries {
  @SeriesEntityDoc.Name()
  @IsString()
  @Length(3, 255)
  name: string;

  @SeriesEntityDoc.Slug()
  @IsString()
  @Length(3, 255)
  slug: string;

  @SeriesEntityDoc.GameIds()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  gameIds?: number[];
}

const _assertExact: ExactData<CreateSeries, CreateSeriesDto> = true;