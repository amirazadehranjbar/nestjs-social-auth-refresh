import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[UsersModule , PassportModule , JwtModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
