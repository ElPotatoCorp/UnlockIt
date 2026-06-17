import {
  EUAgeRating,
  GameType,
  LangCode,
  GameEntity as IGameEntity,
  ExactData,
} from '@unlockit/shared';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import { MediaEntity } from 'src/media/entities/media.entity';
import { GamePlatformEntity } from 'src/platforms/entities/game-platform.entity';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { SeriesEntity } from 'src/series/entities/series.entity';
import { TagEntity } from 'src/tags/entities/tag.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('games')
@Check(`"price" >= 0`)
@Check(`"metacritic_score" BETWEEN 0 AND 100 OR "metacritic_score" IS NULL`)
export class GameEntity implements IGameEntity {
  @GamePrimitiveEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @GamePrimitiveEntityDoc.Name()
  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @GamePrimitiveEntityDoc.Slug()
  @Column('varchar', { length: 255, nullable: false, unique: true })
  slug: string;

  @GamePrimitiveEntityDoc.Type()
  @Column('enum', { enum: GameType, default: GameType.GAME })
  type: GameType;

  @GamePrimitiveEntityDoc.Price()
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @GamePrimitiveEntityDoc.AgeRating()
  @Column('enum', {
    name: 'age_rating',
    enum: EUAgeRating,
    default: EUAgeRating.EIGHTEEN,
  })
  ageRating: EUAgeRating;

  @GamePrimitiveEntityDoc.ReleaseDate()
  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: string | null;

  @GamePrimitiveEntityDoc.ComingSoon()
  @Column('boolean', { name: 'coming_soon', default: false })
  comingSoon: boolean;

  @GamePrimitiveEntityDoc.HeaderImage()
  @Column('varchar', { name: 'header_image', length: 255, nullable: false })
  headerImage: string;

  @GamePrimitiveEntityDoc.CoverImage()
  @Column('varchar', { name: 'cover_image', length: 255, nullable: false })
  coverImage: string;

  @GamePrimitiveEntityDoc.BackgroundImage()
  @Column('varchar', { name: 'background_image', length: 255, nullable: false })
  backgroundImage: string;

  @GamePrimitiveEntityDoc.ShortDescription()
  @Column('text', { name: 'short_description', nullable: false })
  shortDescription: string;

  @GamePrimitiveEntityDoc.DetailedDescription()
  @Column('text', { name: 'detailed_description', nullable: false })
  detailedDescription: string;

  @GamePrimitiveEntityDoc.MetacriticScore()
  @Column('smallint', { name: 'metacritic_score', nullable: true })
  metacriticScore: number | null;

  @GamePrimitiveEntityDoc.Website()
  @Column('varchar', { length: 255, nullable: true })
  website: string | null;

  @GamePrimitiveEntityDoc.PcRequirements()
  @Column('text', { name: 'pc_requirements', nullable: true })
  pcRequirements: string | null;

  @GamePrimitiveEntityDoc.SupportedLanguages()
  @Column('enum', {
    name: 'supported_languages',
    enum: LangCode,
    array: true,
    nullable: true,
  })
  supportedLanguages: LangCode[];

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => SeriesEntity, (series) => series.games, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'series_id' })
  series: SeriesEntity | null;

  @ManyToMany(() => TagEntity, (tag) => tag.games)
  @JoinTable({
    name: 'game_tags',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @ManyToMany(() => DeveloperEntity, (dev) => dev.games)
  @JoinTable({
    name: 'game_developers',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'developer_id', referencedColumnName: 'id' },
  })
  developers: DeveloperEntity[];

  @ManyToMany(() => PublisherEntity, (pub) => pub.games)
  @JoinTable({
    name: 'game_publishers',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'publisher_id', referencedColumnName: 'id' },
  })
  publishers: PublisherEntity[];

  @OneToOne(() => GamePlatformEntity, (gp) => gp.game, {
    cascade: ['insert', 'update'],
  })
  platforms: GamePlatformEntity;

  @OneToMany(() => MediaEntity, (media) => media.game, {
    cascade: ['remove'],
  })
  media: MediaEntity[];

  @OneToMany(() => ReviewEntity, review => review.gameId)
  reviews: ReviewEntity[];
}

const _assertExact: ExactData<IGameEntity, GameEntity> = true;
