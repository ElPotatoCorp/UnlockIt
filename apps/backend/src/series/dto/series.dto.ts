import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';
import { ExactData, Series } from '@unlockit/shared';

export class SeriesDto implements Series {
  @SeriesEntityDoc.Id()
  id: number;

  @SeriesEntityDoc.Name()
  name: string;

  @SeriesEntityDoc.Slug()
  slug: string;

  @SeriesEntityDoc.Games()
  games: SummaryGameDto[];
}

const _assertExact: ExactData<Series, SeriesDto> = true;
