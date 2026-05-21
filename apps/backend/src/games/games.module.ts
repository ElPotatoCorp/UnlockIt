import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UploadModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
