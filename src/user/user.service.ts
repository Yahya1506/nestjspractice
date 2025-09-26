/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {

    }
    async getuser(uid: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            }
        });
        if (user) {
            return user;
        }
    }

}
