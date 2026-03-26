import { CreateUserDtoDoc } from "src/docs/user/dto/create-user.dto.doc";

export class CreateUserDto {
    @CreateUserDtoDoc.Username()
    username: string;

    @CreateUserDtoDoc.Password()
    password: string;

    @CreateUserDtoDoc.Email()
    email: string;
}
