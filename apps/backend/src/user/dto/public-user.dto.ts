import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import { ExactData, PublicUser } from '@unlockit/shared';

export class PublicUserDto implements PublicUser {
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
}

const _assertExact: ExactData<PublicUser, PublicUserDto> = true;
