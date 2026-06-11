import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { SeriesEntity } from '../entities/series.entity';
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

  static async fromEntity(series: SeriesEntity): Promise<SeriesDto> {
    const dto = new SeriesDto();

    dto.id = series.id;
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

const _assertExact: ExactData<Series, SeriesDto> = true;
