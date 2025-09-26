/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserContoller } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserContoller],
    providers: [UserService],
})
export class UserModule { }
