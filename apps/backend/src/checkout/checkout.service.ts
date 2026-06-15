import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { OrderStatus, WalletTransactionType } from '@unlockit/shared';
import { UserEntity } from 'src/user/entities/user.entity';
import { CartItemEntity } from 'src/cart/entities/cart-item.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { OrderItemEntity } from 'src/orders/entities/order-item.entity';
import { WalletTransactionEntity } from 'src/wallet/entities/wallet-transaction.entity';
import { GameEntity } from 'src/games/entities/game.entity';
import { CartService } from 'src/cart/cart.service';
import { OrdersService } from 'src/orders/orders.service';
import { InitiateCheckoutDto } from './dto/initiate-checkout.dto';
import { CheckoutResultDto } from './dto/checkout-result.dto';
import { OrderMapper } from 'src/orders/order.mapper';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
  ) {}

  /** @todo Implement Stripe */
  async initiate(
    userId: string,
    cartId: string,
    dto: InitiateCheckoutDto,
  ): Promise<CheckoutResultDto> {
    const orderId = await this.dataSource.transaction(async (manager) => {
      // Put a lock on update to prevent race condition
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException(`User ${userId} not found.`);
      }

      // Load items
      const cartItems = await manager.find(CartItemEntity, {
        where: { cartId, selected: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('No items selected for checkout.');
      }

      // Load games explicitly within the transaction
      // If the AI say so ¯\(ツ)/¯ :
      // Lazy relations must never be awaited inside a DataSource transaction
      // because they use the global connection pool, not the transaction
      // manager's connection - meaning they would read outside the transaction
      // boundary and bypass any in-flight locks. Always use manager.find.
      const gameIds = cartItems.map((item) => item.gameId);
      const games = await manager.find(GameEntity, {
        where: { id: In(gameIds) },
      });
      const gameMap = new Map(games.map((g) => [g.id, g]));

      // Compute order total in integer cents
      const totalCents = cartItems.reduce((sum, item) => {
        const game = gameMap.get(item.gameId)!;
        return sum + Math.round(game.price * 100) * item.quantity;
      }, 0);

      // Compute wallet / Stripe split
      let walletCoverCents = 0;
      let stripeCoverCents = totalCents;

      if (dto.useWallet) {
        const row = await manager
          .createQueryBuilder(WalletTransactionEntity, 'tx')
          .select('COALESCE(SUM(tx.amount), 0)', 'balance')
          .where('tx.userId = :userId', { userId })
          .getRawOne<{ balance: string }>();

        const balanceCents = Math.round(parseFloat(row?.balance ?? '0') * 100);
        walletCoverCents = Math.min(balanceCents, totalCents);
        stripeCoverCents = totalCents - walletCoverCents;
      }

      if (stripeCoverCents > 0) {
        throw new NotImplementedException(
          'Stripe payment is not yet integrated.',
        );
      }

      // Lock and reserve stock (SKIP LOCKED)
      const stockMap = new Map<number, StockEntity[]>();
      const insufficientStock: Array<{
        gameId: number;
        requested: number;
        available: number;
      }> = [];

      for (const item of cartItems) {
        const stocks = await manager
          .createQueryBuilder(StockEntity, 'stock')
          .where('stock.gameId = :gameId', { gameId: item.gameId })
          .andWhere('stock.orderId IS NULL')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .limit(item.quantity)
          .getMany();

        if (stocks.length < item.quantity) {
          insufficientStock.push({
            gameId: item.gameId,
            requested: item.quantity,
            available: stocks.length,
          });
        } else {
          stockMap.set(item.gameId, stocks);
        }
      }

      if (insufficientStock.length > 0) {
        throw new ConflictException({
          message: 'Insufficient stock for one or more items.',
          items: insufficientStock,
        });
      }

      // Persist the order
      const order = manager.create(OrderEntity, {
        userId,
        status: OrderStatus.PENDING_PAYMENT,
        amountPaidWallet: walletCoverCents / 100,
        amountPaidStripe: 0,
      });
      await manager.save(OrderEntity, order);

      // Persist the items now
      await manager.insert(
        OrderItemEntity,
        cartItems.map((item) => ({
          orderId: order.id,
          gameId: item.gameId,
          quantity: item.quantity,
          unitPrice: gameMap.get(item.gameId)!.price,
        })),
      );

      // Link reserved stock rows to order
      const allStockIds = [...stockMap.values()].flat().map((s) => s.id);

      await manager
        .createQueryBuilder()
        .update(StockEntity)
        .set({ orderId: order.id })
        .where('id IN (:...ids)', { ids: allStockIds })
        .execute();

      // Debit wallet and complete (wallet-only path)
      await manager.insert(WalletTransactionEntity, {
        userId,
        orderId: order.id,
        amount: -(walletCoverCents / 100),
        type: WalletTransactionType.PURCHASE,
      });

      // Soft-delete marks stock rows as sold (usedAt = NOW()).
      await manager
        .createQueryBuilder()
        .softDelete()
        .from(StockEntity)
        .where('id IN (:...ids)', { ids: allStockIds })
        .execute();

      order.status = OrderStatus.COMPLETED;
      order.completedAt = new Date();
      await manager.save(OrderEntity, order);

      return order.id;
    });

    // Post-transaction cleaning
    await this.cartService.clear(cartId);

    // Finally return what we want
    const order = await this.ordersService.findOne(orderId, userId);
    return OrderMapper.toCheckout(order, null);
  }
}
