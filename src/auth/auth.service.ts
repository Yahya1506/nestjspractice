/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {

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

        return user;
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


        return user;
    }
}