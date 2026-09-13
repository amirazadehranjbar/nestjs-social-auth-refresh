import {Body, Controller, Post} from '@nestjs/common';
import {UsersService} from './users.service.js';
import {RegisterDto} from './dtos/register.dto.js';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @Post()
    async create(@Body() userData: RegisterDto) {
        const {username, email, password} = userData;
        return this.userService.create(username, email, password)


    }
}
