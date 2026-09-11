import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './schemas/userModel.js';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto.js';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async createUser(userData: CreateUserDto) {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);

    const newUser = new this.userModel({...userData, hash});

    await newUser.save();

    return newUser;

  }
}
