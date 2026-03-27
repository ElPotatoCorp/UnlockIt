import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export class CreateUserDto {
    @UserEntityDoc.Username()
    username: string;

    @UserEntityDoc.Password()
    password: string;

    @UserEntityDoc.Email()
    email: string;
}
