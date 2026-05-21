import {
  EUAgeRating,
  GameType,
  LangCode,
  Game as IGame,
} from '@unlockit/shared';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
import { GameEntityDoc } from 'src/docs/games/entities/game.entity.doc';
import { Series } from 'src/series/entities/series.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('games')
@Check(`"price" >= 0`)
@Check(`"metacritic_score" BETWEEN 0 AND 100 OR "metacritic_score" IS NULL`)
export class Game implements IGame {
  @GameEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @GameEntityDoc.Name()
  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @GameEntityDoc.Slug()
  @Column('varchar', { length: 255, nullable: false, unique: true })
  slug: string;

  @GameEntityDoc.Type()
  @Column('enum', { enum: GameType, default: GameType.GAME })
  type: GameType;

  @GameEntityDoc.Price()
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @GameEntityDoc.AgeRating()
  @Column('enum', {
    name: 'age_rating',
    enum: EUAgeRating,
    default: EUAgeRating.EIGHTEEN,
  })
  ageRating: EUAgeRating;

  @GameEntityDoc.ReleaseDate()
  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: string | null;

  @GameEntityDoc.ComingSoon()
  @Column('boolean', { name: 'coming_soon', default: false })
  comingSoon: boolean;

  @GameEntityDoc.HeaderImage()
  @Column('varchar', { name: 'header_image', length: 255, nullable: false })
  headerImage: string;

  @GameEntityDoc.CoverImage()
  @Column('varchar', { name: 'cover_image', length: 255, nullable: false })
  coverImage: string;

  @GameEntityDoc.BackgroundImage()
  @Column('varchar', { name: 'background_image', length: 255, nullable: false })
  backgroundImage: string;

  @GameEntityDoc.ShortDescription()
  @Column('text', { name: 'short_description', nullable: false })
  shortDescription: string;

  @GameEntityDoc.DetailedDescription()
  @Column('text', { name: 'detailed_description', nullable: false })
  detailedDescription: string;

  @GameEntityDoc.MetacriticScore()
  @Column('smallint', { name: 'metacritic_score', nullable: true })
  metacriticScore: number | null;

  @GameEntityDoc.Website()
  @Column('varchar', { length: 255, nullable: true })
  website: string | null;

  @GameEntityDoc.PcRequirements()
  @Column('text', { name: 'pc_requirements', nullable: true })
  pcRequirements: string | null;

  @GameEntityDoc.SupportedLanguages()
  @Column('enum', {
    name: 'supported_languages',
    enum: LangCode,
    array: true,
    nullable: true,
  })
  supportedLanguages: LangCode[] | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => Series, (series) => series.games, {
    lazy: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'series_id' })
  series: Series | null;
}
