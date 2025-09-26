/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import type { Request } from "supertest";
import { SessionGuard } from "./gaurd";


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { };

    @Post('login')
    login(@Body() dto: AuthDto) {

        return this.authService.login(dto);
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {

        return this.authService.signup(dto);
    }
    @UseGuards(SessionGuard)
    @Post('logout')
    async logout(@Req() req: Request) {

        const sessionId = (req as any).user.sessionId;
        if (sessionId) {
            await this.authService.revokeSession(sessionId);
        }



        return { ok: true };
    }
}