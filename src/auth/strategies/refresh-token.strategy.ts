import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {Request} from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService) {
        const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
            // fail fast at startup rather than getting a confusing runtime error later
            throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            passReqToCallback: true,
            secretOrKey: refreshSecret, // now guaranteed to be `string`, not `string | undefined`
        });
    }

    validate(req: Request, payload: { sub: string }) {
        const refreshToken = req.body?.refreshToken;
        if (!refreshToken) throw new UnauthorizedException();
        // AuthService needs the raw token to compare against the stored hash
        return {userId: payload.sub, refreshToken};
    }
}