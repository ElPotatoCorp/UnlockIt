import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import { UploadModule } from 'src/upload/upload.module';
import { TagsModule } from 'src/tags/tags.module';
import { DevelopersModule } from 'src/developers/developers.module';
import { GamePlatform } from 'src/platforms/entities/game-platform.entity';
import { Media } from 'src/media/entities/media.entity';
import { PublishersModule } from 'src/publishers/publishers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, GamePlatform, Media]),
    TagsModule,
    DevelopersModule,
    PublishersModule,
    UploadModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
