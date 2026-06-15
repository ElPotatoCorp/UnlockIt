import { TagEntityDoc } from 'src/docs/tags/entities/tag.entity.doc';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from 'src/games/entities/game.entity';
import { ExactData, TagEntity as ITagEntity } from '@unlockit/shared';

@Entity('tags')
export class TagEntity implements ITagEntity {
  @TagEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @TagEntityDoc.Name()
  @Column('varchar', { length: 150, unique: true })
  name: string;

  @TagEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => GameEntity, (game) => game.tags, { lazy: true })
  games: GameEntity[];
}

const _assertExact: ExactData<ITagEntity, TagEntity> = true;
