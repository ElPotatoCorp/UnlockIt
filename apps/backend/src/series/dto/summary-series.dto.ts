import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { SeriesEntity } from '../entities/series.entity';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';
import { SummarySeries } from '@unlockit/shared';

export class SummarySeriesDto implements SummarySeries {
  @SeriesEntityDoc.Name()
  name: string;

  @SeriesEntityDoc.Slug()
  slug: string;

  @SeriesEntityDoc.Games()
  games: SummaryGameDto[];

  static async fromEntity(series: SeriesEntity): Promise<SummarySeriesDto> {
    const dto = new SummarySeriesDto();

    dto.name = series.name;
    dto.slug = series.slug;
    dto.games = series.games
      ? await series.games.then((games) =>
          games.map((game: any) => SummaryGameDto.fromEntity(game)),
        )
      : [];
    
    return dto;
  }
}
