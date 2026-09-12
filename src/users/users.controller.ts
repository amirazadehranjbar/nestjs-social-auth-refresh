import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RegisterDto } from './dtos/register.dto.js';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() createUserDto: RegisterDto) {
    return this.userService.createUser(createUserDto)
  }

}
