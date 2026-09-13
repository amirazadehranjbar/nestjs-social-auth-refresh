import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {RefreshTokenStrategy} from "./strategies/refresh-token.strategy.js";
import {JwtStrategy} from "./strategies/jwt.strategy.js";

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule], // <- this
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
