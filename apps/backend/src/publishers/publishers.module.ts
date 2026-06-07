import { Module } from '@nestjs/common';
import { PublisherEntity } from './entities/publisher.entity';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PublisherEntity])],
  controllers: [PublishersController],
  providers: [PublishersService],
  exports: [TypeOrmModule],
})
export class PublishersModule {}
