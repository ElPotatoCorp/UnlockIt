import { UserEntity } from 'src/user/entities/user.entity';
import { Factory } from './base.factory';
import { EntityTarget } from 'typeorm';

export class UserFactory extends Factory<UserEntity> {
  get entity(): EntityTarget<UserEntity> {
    return UserEntity;
  }

  async definition(): Promise<Partial<UserEntity>> {
    // Simple strong password without regex (avoids stack overflow)
    const randomStr = Math.random().toString(36).substring(2, 15);
    const password = `Test${randomStr}!Aa`;

    return {
      username: this.fk.internet.username(),
      email: this.fk.internet.email(),
      password,
      phoneNumber: this.fk.datatype.boolean()
        ? this.fk.phone.number({ style: 'international' })
        : null,
      bio: this.fk.datatype.boolean() ? this.fk.lorem.paragraph() : null,
      avatar: null, // Skip image generation to avoid timeout
      wallet: this.fk.number.float({ min: 0, max: 500, fractionDigits: 2 }),
    };
  }
}
