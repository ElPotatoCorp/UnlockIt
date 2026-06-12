import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import { UploadModule } from 'src/upload/upload.module';
import { TagsModule } from 'src/tags/tags.module';
import { DevelopersModule } from 'src/developers/developers.module';
import { GamePlatformEntity } from 'src/platforms/entities/game-platform.entity';
import { MediaEntity } from 'src/media/entities/media.entity';
import { PublishersModule } from 'src/publishers/publishers.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, GamePlatformEntity, MediaEntity]),
    TagsModule,
    DevelopersModule,
    PublishersModule,
    StocksModule,
    UploadModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [TypeOrmModule],
})
export class GamesModule {}
