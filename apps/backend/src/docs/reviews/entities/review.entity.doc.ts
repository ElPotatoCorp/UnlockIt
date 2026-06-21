import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { MakeDoc } from "src/docs/common/make-doc";
import { GamePrimitiveEntityDoc } from "src/docs/games/entities/game-primitive.entity.doc";
import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export const ReviewEntityDoc = {
  Id: MakeDoc.MakeUUID('Review ID'),

  UserId: UserEntityDoc.Id,

  GameId: GamePrimitiveEntityDoc.Id,

  Content: () =>
    applyDecorators(
      ApiProperty({
        title: 'Content of the review.',
        type: String,
        minLength: 20,
        maxLength: 100000,
        example: 'This documentation is very good! I do not know who made it but I would recommand the teams behind this website to make a new banger! :D'
      })
    ),

  Rate: () =>
    applyDecorators(
      ApiProperty({
        title: 'Rating',
        type: Number,
        minimum: 0,
        maximum: 10,
        example: 10
      })
    ),
  
  HelpfulCount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Helpful counter',
        description: 'The number of people who found this review useful',
        type: Number,
        minimum: 0,
        example: 15,
      })
    ),

  UnhelpfulCount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Unhelpful counter',
        description: 'The number of people who found this review useless',
        type: Number,
        minimum: 0,
        example: 15,
      })
    ),

  LastEdited: () =>
    applyDecorators(
      ApiProperty({
        title: 'Last Edition Date',
        type: Date,
        nullable: true,
      })
    ),

  Voted: () =>
    applyDecorators(
      ApiProperty({
        title: 'Voted',
        description: 'If the optionally authenticated user has voted for this review',
        type: Boolean,
        nullable: true,
        required: false,
      })
    )
}