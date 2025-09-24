/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {

    }
    login() {
        return "this is login";
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
            }
        });


        return user;
    }
}