import {IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string

    email: string

    password: string

}