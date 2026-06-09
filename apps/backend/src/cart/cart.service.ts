import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { GameEntity } from 'src/games/entities/game.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItemDto } from './dto/cart-items.dto';
import { isBoolean, isInt } from 'class-validator';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    private readonly commonService: CommonService,
  ) {}

  getCartContent(cartId:string, pagination: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(this.cartItemRepository, pagination, {
      where: { cartId },
      order: { addedAt: 'DESC' },
      relations: { game: true },
      transform: CartItemDto.fromEntity,
    });
  }

  async toggle(cartId: string, gameId: number, state?: boolean) {
    const item = await this.cartItemRepository.findOneBy({ cartId, gameId });

    if (!item) {
      throw new NotFoundException(`Game with ID ${gameId} was not found in the cart`);
    }

    let newState: boolean;
    if (state && isBoolean(state)) {
      newState = state;
    } else {
      newState = !item.selected;
    }

    await this.cartItemRepository.update({ cartId, gameId }, { selected: newState });
  }

  async add(cartId: string, gameId: number, quantity?: number): Promise<void> {
    const item = await this.cartItemRepository.findOneBy({ cartId, gameId });
    const isValidQuantity = quantity && isInt(quantity) && quantity > 0;

    if (item) {
      const newQuantity = item.quantity + (isValidQuantity ? quantity : 1);
      await this.cartItemRepository.update({ cartId, gameId }, { quantity: newQuantity });
    } else {
      await this.cartItemRepository.save({ cartId, gameId, quantity: (isValidQuantity ? quantity : 1) });
    }
  }

  async remove(cartId: string, gameId: number, quantity?: number): Promise<void> {
    const item = await this.cartItemRepository.findOneBy({ cartId, gameId });
    
    if (!item) {
      return;
    }
    
    const isValidQuantity = quantity && isInt(quantity) && quantity > 0;
    const newQuantity = item.quantity + (isValidQuantity ? quantity : 1);

    if (newQuantity > 0) {
      await this.cartItemRepository.update({ cartId, gameId }, { quantity: newQuantity });
    } else {
      await this.cartItemRepository.delete({ cartId, gameId });
    }
  }

  async clear(cartId: string): Promise<void> {
    await this.cartItemRepository.delete({ cartId });
  }
}
