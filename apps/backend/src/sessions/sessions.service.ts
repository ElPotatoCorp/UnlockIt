import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { LessThan, Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  isExpired(session: SessionEntity): boolean {
    return session.expiresAt.getTime() < Date.now();
  }

  createOrUpdate(session: CreateSessionDto) {
    return this.sessionRepository.upsert(session, ['id']);
  }

  findOne(id: string) {
    return this.sessionRepository.findOne({ where: { id } });
  }

  findByUserAndRefreshTokenHash(userId: string, refreshTokenHash: string) {
    return this.sessionRepository.findOne({
      where: { userId, refreshTokenHash },
    });
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.sessionRepository.update(id, updateSessionDto);
  }

  delete(id: string) {
    return this.sessionRepository.delete(id);
  }

  deleteAllForUser(userId: string) {
    return this.sessionRepository.delete({ userId });
  }

  async deleteExpired(session: SessionEntity) {
    await this.sessionRepository.delete(session.id);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  deleteAllExpired() {
    this.sessionRepository.delete({ expiresAt: LessThan(new Date()) });
  }
}
