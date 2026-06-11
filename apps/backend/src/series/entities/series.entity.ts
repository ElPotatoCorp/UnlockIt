import { ExactData, SeriesEntity as ISeriesEntity } from '@unlockit/shared';
import { SeriesEntityDoc } from 'src/docs/series/entities/series.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('series')
export class SeriesEntity implements ISeriesEntity {
  @SeriesEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @SeriesEntityDoc.Name()
  @Column('varchar', { length: 255 })
  name: string;

  @SeriesEntityDoc.Slug()
  @Column('varchar', { length: 255 })
  slug: string;

  // =====================================================
  // Relations
  // =====================================================

  @SeriesEntityDoc.Games()
  @OneToMany(() => GameEntity, (game) => game.series, { lazy: true })
  games: Promise<GameEntity[]>;
}

const _assertExact: ExactData<ISeriesEntity, SeriesEntity> = true;
