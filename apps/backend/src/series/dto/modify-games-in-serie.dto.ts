import { ExactData, ModifyGamesInSeries } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';

export class ModifyGamesInSerieDto implements ModifyGamesInSeries {
  @SeriesEntityDoc.GameIds()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  gameIds: number[];
}

const _assertExact: ExactData<ModifyGamesInSeries, ModifyGamesInSerieDto> = true;