import { ApiProperty } from '@nestjs/swagger';
import { ExactData, Wishlist } from '@unlockit/shared';
import { WishlistEntityDoc } from 'src/docs/wishlist/entities/wishlist.entity.doc';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class WishlistDto implements Wishlist {
  @ApiProperty({
    title: 'Summary of the wishlisted game',
    type: SummaryGameDto
  })
  game: SummaryGameDto;

  @WishlistEntityDoc.AddedAt()
  addedAt: Date;
}

const _assertExact: ExactData<Wishlist, WishlistDto> = true;
