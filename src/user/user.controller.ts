import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { Observable } from 'rxjs';

import axios from 'axios';
//import { AdminAuthGuard, JwtAuthGuard } from '../../auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/registration')
  async registration(@Body() user: User): Promise<User> {
    return await this.userService.createUser(user);
  }

  //@UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userService.createUser(user);
  }

  //@UseGuards(AdminAuthGuard)
  /*@Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }*/

  //@UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return await this.userService.updateUser(id, user);
  }

  //@UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  findAllUsersExepctUser(@Param('id') id: string): Promise<User[]> {
    return this.userService.findAllUsersExepctUser(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/savefriendlist/:steamId/:userId')
  async saveSteamUserFriendListAndData(
    @Param('steamId') steamId: string,
    @Param('userId') userId: string,
  ): Promise<any> {
    return await this.userService.saveSteamUserFriendListAndData(
      steamId,
      userId,
      'steam',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/deleteuseraccount/:userId/:type')
  async deleteUserAccount(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ): Promise<void> {
    return await this.userService.deleteUserAccount(userId, type);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/friendlist')
  async clearFriendsTable() {
    return await this.userService.clearFriendsTable();
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/deleteuserfriendlistanddata/:userId/:type')
  async deleteUserFriendlistAndData(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    return await this.userService.deleteUserFriendListAndData(userId, type);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/getfriendlistdata/:steamId')
  async getSteamUserFriendListAndData(
    @Param('steamId') steamId: string,
  ): Promise<any> {
    return await this.userService.getSteamUserFriendListAndData(steamId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/saveaccountdata/:accountId/:userId/:type')
  async saveAccountData(
    @Param('accountId') accountId: string,
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    return await this.userService.saveAccountData(accountId, userId, type);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/getaccountdata/:accountId/:userId')
  async getAccountData(
    @Param('accountId') accountId: string,
    @Param('userId') userId: string,
  ) {
    return await this.userService.getAccountData(accountId, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/getaccountdatafromsteam/:userId')
  async getAccountDataFromSteam(@Param('userId') userId: string) {
    return await this.userService.getAccountDataFromSteam(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/checkforaccounts/:userId/:type')
  async checkForAccounts(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    return await this.userService.checkForAccounts(userId, type);
  }
}
