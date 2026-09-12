import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/userSchema.js';
import { RegisterDto } from './dtos/register.dto.js';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
  }

  async create(email: string, password: string): Promise<UserDocument> {


    const existing = await this.userModel.findOne({ email });

    if ( existing ) {
      // Fail with a clear message instead of letting Mongo's unique index
      // throw a raw duplicate-key error
      throw new ConflictException('Username is already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new this.userModel({ email, passwordHash });

    return user.save();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }).exec();
  }
}
