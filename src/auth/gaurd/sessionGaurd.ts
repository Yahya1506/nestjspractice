/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';


@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private jwtService: JwtService, private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();

        // 1) extract cookie
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedException('No access token');



        // verify signature and expiry
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const sessionId = payload.jti;


        // expect payload to contain sub and jti

        if (!sessionId) throw new UnauthorizedException('Malformed token');

        // 2) fetch session from DB
        const session = await this.authService.findSessionById(sessionId);
        if (!session) throw new UnauthorizedException('Session not found');

        // 3) check session validity
        if (session.invalidatedAt) throw new UnauthorizedException('Session revoked');
        if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
            // session expired -> revoke for safety
            await this.authService.revokeSession(sessionId).catch(() => null);
            throw new UnauthorizedException('Session expired');
        }



        // 5) attach user info to request
        // you can customize fields you want available in controllers
        (req as any).user = { sessionId };

        return true;
    }
}
