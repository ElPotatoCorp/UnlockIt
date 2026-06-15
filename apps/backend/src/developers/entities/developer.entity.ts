import {
  ExactData,
  DeveloperEntity as IDeveloperEntity,
} from '@unlockit/shared';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('developers')
export class DeveloperEntity implements IDeveloperEntity {
  @DeveloperEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @DeveloperEntityDoc.Name()
  @Column('varchar', { length: 200, unique: true })
  name: string;

  @DeveloperEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => GameEntity, (game) => game.developers, { lazy: true })
  games: GameEntity[];
}

const _assertExact: ExactData<IDeveloperEntity, DeveloperEntity> = true;
