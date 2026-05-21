import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';

export class ModifyGamesInSerieDto {
  @SeriesEntityDoc.GameIds()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  gameIds: number[];
}
