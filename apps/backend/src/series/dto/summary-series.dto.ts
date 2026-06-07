import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { Series } from '../entities/series.entity';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';
import { SummarySeries } from '@unlockit/shared';

export class SummarySeriesDto implements SummarySeries {
  @SeriesEntityDoc.Name()
  name: string;

  @SeriesEntityDoc.Slug()
  slug: string;

  @SeriesEntityDoc.Games()
  games: SummaryGameDto[];

  static async fromEntity(series: Series): Promise<SummarySeriesDto> {
    const summarySeriesDto = new SummarySeriesDto();
    summarySeriesDto.name = series.name;
    summarySeriesDto.slug = series.slug;
    summarySeriesDto.games = series.games
      ? await series.games.then((games) =>
          games.map((game: any) => SummaryGameDto.fromEntity(game)),
        )
      : [];
    return summarySeriesDto;
  }
}
