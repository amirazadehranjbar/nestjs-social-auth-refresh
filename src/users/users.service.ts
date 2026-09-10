import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {UserModel} from "./schemas/userModel.js";
import {Model} from "mongoose";

@Injectable()
export class UsersService {

    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModel>) {}

}
