import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import { UserEntity } from '../entities/user.entity';

export class PublicUserDto {
  @UserEntityDoc.Id()
  id: string;

  @UserEntityDoc.Username()
  username: string;

  @UserEntityDoc.Bio()
  bio: string | null;

  @UserEntityDoc.Avatar()
  avatar: string | null;

  @UserEntityDoc.CreatedAt()
  createdAt: Date;

  static fromEntity(user: UserEntity): PublicUserDto {
    const dto = new PublicUserDto();

    dto.id = user.id;
    dto.username = user.username;
    dto.bio = user.bio;
    dto.avatar = user.avatar;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
