/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwt: JwtService, private config: ConfigService) {

    }
    async login(dto: AuthDto) {

        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) return { message: "email does not exists" };

        const password = await argon.verify(user.password, dto.password);
        if (!password) return { message: "wrong password" }

        const sess = await this.createSession(user.id);
        console.log(sess);
        return this.signToken(user.id, user.email, sess.id)

    }

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        const email = await this.prismaService.user.findFirst({ where: { email: dto.email } });
        if (email)
            return { msg: "email already exists" }
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: hash,
                firstName: dto.firstName,
                LastName: dto.lastName
            }
        });


        return { message: "sign up successful" };
    }


    // Return session or null
    async findSessionById(sessionId: string) {
        return this.prismaService.session.findUnique({
            where: { id: sessionId },
        });
    }

    // Revoke a session (mark invalidatedAt). Returns the updated session
    async revokeSession(sessionId: string) {
        const existing = await this.findSessionById(sessionId);
        if (!existing) return null;

        return this.prismaService.session.update({
            where: { id: sessionId },
            data: { invalidatedAt: new Date() },
        });
    }

    async signToken(userId: number, email: string, jti: string) {
        const payload = {
            id: userId,
            email,
            jti,
        };

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });

        return {
            access_token: token,
        }
    }
    async createSession(userId: number) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const session = await this.prismaService.session.create({
            data: {
                userId,
                expiresAt,
            }
        });
        return session;
    }


}