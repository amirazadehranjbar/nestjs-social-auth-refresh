import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {UsersService} from "../users/users.service.js";
import {UserDocument} from "../users/schemas/userSchema.js";


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    async register(username: string, email: string, password: string) {

        const user = await this.userService.create(username, email, password);
        return {id: user._id, username: user.username, email: user.email};
    }

    // Called by the login endpoint before any token is issued
    async validateUser(email: string, password: string): Promise<UserDocument> {
        const user = await this.userService.findByEmail(email);
        // Compare against the bcrypt hash — the article compared plain text directly
        const isMatch = user && (await bcrypt.compare(password, user.passwordHash));
        if (!user || !isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return user;
    }

    async login(user: UserDocument) {
        const tokens = await this.issueTokens(user._id.toString());
        // Store a hash of the refresh token, never the token itself
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.userService.setRefreshTokenHash(user._id.toString(), refreshTokenHash);
        return tokens;
    }

    async refresh(userId: string, refreshToken: string) {
        const user = await this.userService.findById(userId);
        if (!user || !user.refreshTokenHash) {
            throw new UnauthorizedException('Session expired, please log in again');
        }
        const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isMatch) {
            throw new UnauthorizedException('Session expired, please log in again');
        }
        // Rotate: issue a brand-new pair and invalidate the old refresh token
        const tokens = await this.issueTokens(userId);
        const newHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.userService.setRefreshTokenHash(userId, newHash);
        return tokens;
    }

    async logout(userId: string) {
        await this.userService.setRefreshTokenHash(userId, null);
    }

    private async issueTokens(userId: string) {
        const payload = {sub: userId};
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
            }),
        ]);
        return {accessToken, refreshToken};
    }
}