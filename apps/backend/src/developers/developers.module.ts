import { Module } from '@nestjs/common';
import { Developer } from './entities/developer.entity';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Developer])],
  controllers: [DevelopersController],
  providers: [DevelopersService],
  exports: [TypeOrmModule],
})
export class DevelopersModule {}