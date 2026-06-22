import { GameMapper } from 'src/games/game.mapper';
import { SeriesDto } from './dto/series.dto';
import { SeriesEntity } from './entities/series.entity';

export class SeriesMapper {
  static toSeries(series: SeriesEntity) {
    const dto = new SeriesDto();

    dto.id = series.id;
    dto.name = series.name;
    dto.slug = series.slug;
    dto.games = series.games
      ? series.games.map((game) => GameMapper.toSummary(game))
      : [];

    return dto;
  }
}
