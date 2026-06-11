import { ExactData, StockEntity as IStockEntity } from "@unlockit/shared";
import { GameEntity } from "src/games/entities/game.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('stocks')
export class StockEntity implements IStockEntity {
  @PrimaryColumn('varchar', { name: 'product_key', length: 100 })
  productKey: string;

  @Column('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => GameEntity, (game) => game.stocks, {
    lazy: true,
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  // This is used to soft delete using TypeORM's built-in feature
  @DeleteDateColumn({ name: 'used_at', nullable: true })
  usedAt: Date | null;
}

const _assertExact: ExactData<IStockEntity, StockEntity> = true;
