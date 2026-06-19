import { StockEntity } from 'src/stocks/entities/stock.entity';
import { Factory } from './base.factory';
import { GameEntity } from 'src/games/entities/game.entity';
import { DeepPartial } from 'typeorm';

export type StockRow = { productKey: string; gameId: number };

export class StockFactory extends Factory<StockEntity, StockRow> {
  get entity() {
    return StockEntity;
  }

  async definition(gameIdOrIds?: number | number[]): Promise<StockRow> {
    if (!gameIdOrIds) {
      gameIdOrIds = (
        await this.datasource!.manager.find(GameEntity, { select: ['id'] })
      ).map((value) => value.id);

      if (gameIdOrIds.length === 0) {
        throw new Error(
          'You cannot create fake stock if there is no game to add stock to',
        );
      }
    }

    let selectedGameId: number;
    if (Array.isArray(gameIdOrIds)) {
      selectedGameId =
        gameIdOrIds[
          this.fk.number.int({ min: 0, max: gameIdOrIds.length - 1 })
        ];
    } else {
      selectedGameId = gameIdOrIds;
    }

    const productKey = this.fk.string.alphanumeric({
      length: { min: 10, max: 16 },
      casing: 'upper',
    });

    return { productKey, gameId: selectedGameId };
  }

  async make(overrides: DeepPartial<StockEntity>) {
    const [result] = await this.makeMany(1, overrides);
    return result;
  }

  async makeMany(count: number, overrides: DeepPartial<StockEntity>) {
    this.assertDatasource();

    const gameIds = (
      await this.datasource!.manager.find(GameEntity, { select: ['id'] })
    ).map((value) => value.id);

    if (gameIds.length === 0) {
      throw new Error(
        'You cannot create fake stock if there is no game to add stock to',
      );
    }

    if (overrides.gameId && !gameIds.find((id) => id === overrides.gameId)) {
      throw new Error(
        `The game of ID "${overrides.gameId}" you required stock on does not exist`,
      );
    } else if (overrides.gameId) {
      console.log(
        `Seeding ${count} product key for the game of ID "${overrides.gameId}"`,
      );
    }

    const productKeys: StockRow[] = [];
    for (let i = 0; i < count; i++) {
      productKeys.push(
        await this.definition(overrides.gameId ? overrides.gameId : gameIds),
      );
    }

    return productKeys;
  }
}
