import {
  ExactData,
  PublisherEntity as IPublisherEntity,
} from '@unlockit/shared';
import { PublisherEntityDoc } from 'src/docs/publishers/entities/publisher.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export class PublisherEntity implements IPublisherEntity {
  @PublisherEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @PublisherEntityDoc.Name()
  @Column('varchar', { length: 200, unique: true })
  name: string;

  @PublisherEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => GameEntity, (game) => game.publishers, { lazy: true })
  games: GameEntity[];
}

const _assertExact: ExactData<IPublisherEntity, PublisherEntity> = true;
