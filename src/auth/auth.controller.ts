import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service.js";
import {RegisterDto} from "../users/dtos/register.dto.js";
import {LoginDto} from "../users/dtos/login.dto.js";
import {RefreshTokenGuard} from "./guards/refresh-token.guard.js";
import {JwtAuthGuard} from "./guards/jwt-auth.guard.js";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.username, dto.email, dto.password);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        return this.authService.login(user);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refresh(@Req() req : any) {
        // req.user comes from RefreshTokenStrategy.validate() above
        return this.authService.refresh(req.user.userId, req.user.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Req() req :any) {
        return this.authService.logout(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    profile(@Req() req :any) {
        // Only reachable with a valid, unexpired access token
        return req.user;
    }
}