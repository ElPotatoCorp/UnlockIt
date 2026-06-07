import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>,
  ) {}

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

  isExpired(session: SessionEntity): boolean {
    return session.expiresAt.getTime() < Date.now();
  }

  async deleteExpired(session: SessionEntity): Promise<void> {
    await this.sessionRepository.delete(session.id);
  }
}
