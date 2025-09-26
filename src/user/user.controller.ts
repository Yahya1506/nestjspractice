/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { UserService } from "./user.service";
import { GetUser } from "src/auth/decorator/get-user.decorator";


@Controller('user')
export class UserContoller {

    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getuser(@GetUser('id') id: number) {
        return this.userService.getuser(id);
    }

}