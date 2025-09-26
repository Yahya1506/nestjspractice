/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        const secret = config.get<string>('JWT_SECRET')
        if (!secret) {
            console.log(secret);
            throw new Error('JWT_SECRET is not set in environment');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });

    }

    async validate(payload: { id: number, email: string }) {
        console.log(payload);
        return { id: payload.id, email: payload.email };;
    }
}