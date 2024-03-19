import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const hashedPassword = await crypto
      .createHmac('sha256', process.env.USER_SALT)
      .update(user.password)
      .digest('base64');

    user.password = hashedPassword;

    return await this.prisma.user.create({ data: user });
  }

  async deleteUser(id: string): Promise<User> {
    await this.prisma.user.delete({ where: { id } });
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async deleteAllUsers(): Promise<void> {
    await this.prisma.user.deleteMany();
  }

  async updateUser(id: string, user: User): Promise<User> {
    await this.prisma.user.update({ where: { id }, data: user });
    return await this.findUserById(id);
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    this.cannotFindUser(user);
    return user;
  }

  async findAllUsersExceptUser(id: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          id: id,
        },
      },
    });
  }

  async searchUsers(searchString: string, userId: string): Promise<User[]> {
    try {
      const users = await this.findAllUsersExceptUser(userId); // Assuming this is an asynchronous function
      const searchResult = users.filter((user) =>
        user.name.toLowerCase().includes(searchString.toLowerCase()),
      );
      return searchResult;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }

  cannotFindUser(user: User): void {
    if (!user) {
      throw new HttpException(
        new Error('User not found. Cannot find user'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //@Cron(CronExpression.EVERY_5_MINUTES)
  async saveSteamUserFriendListAndData(
    steamId: string,
    userId: string,
    steam: string,
  ): Promise<any> {
    try {
      const listResponse = await axios.get(process.env.STEAM_API_FRIENDS_URL, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: steamId,
          relationship: 'friend',
        },
      });

      const friends = listResponse.data.friendslist.friends;
      const friendsIds = friends.map(
        (friend: { steamid: string }) => friend.steamid,
      );

      const dataResponse = await axios.get(process.env.STEAM_API_DATA_URL, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamids: friendsIds.join(','),
        },
      });

      const friendsData = dataResponse.data.response.players;

      for (const friend of friendsData) {
        await this.prisma.friend.upsert({
          where: {
            accountId: friend.steamid,
          },
          update: {
            userId: userId,
            name: friend.personaname,
            avatar: friend.avatar,
            status: friend.personastate,
            game: friend.gameextrainfo,
          },
          create: {
            userId: userId,
            name: friend.personaname,
            accountId: friend.steamid,
            status: friend.personastate,
            game: friend.gameextrainfo,
            avatar: friend.avatar,
            friendType: steam,
          },
        });
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error in getSteamUserFriendListAndData:', error);
      throw error;
    }
  }

  async deleteUserFriendListAndData(userId: string, type: string) {
    try {
      await this.prisma.friend.deleteMany({
        where: {
          userId: userId,
          friendType: type,
        },
      });
      console.log('Successfully deleted friends for user with ID:', userId);
    } catch (error) {
      console.error('Error deleting friends:', error);
    }
  }

  async deleteUserAccount(userId: string, type: string) {
    try {
      const account = await this.prisma.account.findFirst({
        where: {
          userId: userId,
          type: type,
        },
      });

      if (account) {
        await this.prisma.account.delete({
          where: {
            id: account.id,
          },
        });
      } else {
        console.log('Account not found for deletion');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }
  async clearFriendsTable() {
    try {
      const deleteResult = await this.prisma.friend.deleteMany();
      console.log(
        `Deleted ${deleteResult.count} records from the Friend table.`,
      );
    } catch (error) {
      console.error('Error clearing Friends table:', error);
      throw error;
    }
    return 'Cleared Friends Table';
  }

  async getSteamUserFriendListAndData(steamId: string): Promise<any> {
    try {
      const friends = await this.prisma.friend.findMany({
        where: {
          userId: steamId,
        },
      });
      return friends;
    } catch (error) {
      console.error('Error in getFriendsData:', error);
      throw error;
    }
  }

  async saveAccountData(
    accountId: string,
    userId: string,
    type: string,
  ): Promise<any> {
    try {
      const existingAccount = await this.prisma.account.findFirst({
        where: {
          userId: userId,
          accountId: accountId,
        },
      });

      if (existingAccount) {
        return existingAccount;
      }

      const profileResponse = await axios.get(process.env.STEAM_API_DATA_URL, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamids: accountId,
        },
      });

      await this.prisma.account.create({
        data: {
          userId: userId,
          type: type,
          accountName: profileResponse.data.response.players[0].personaname,
          accountId: profileResponse.data.response.players[0].steamid,
          avatar: profileResponse.data.response.players[0].avatar,
        },
      });

      return profileResponse.data.response.players[0];
    } catch (error) {
      console.error('Error in saveAccountData:', error);
      throw error;
    }
  }

  async getAccountData(accountId: string, userId: string): Promise<any> {
    const profileData = await this.prisma.account.findFirst({
      where: {
        accountId: accountId,
        userId: userId,
      },
    });
    return profileData;
  }

  async getAccountDataFromSteam(steamId: string): Promise<any> {
    try {
      const dataResponse = await axios.get(process.env.STEAM_API_DATA_URL, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamids: steamId,
        },
      });
      return dataResponse.data.response.players[0];
    } catch (error) {
      console.error('Error in getAccountDataFromSteam:', error);
      throw error;
    }
  }

  async checkForAccounts(userId: string, type: string) {
    try {
      const existingAccount = await this.prisma.account.findFirst({
        where: {
          userId: userId,
          type: type,
        },
      });

      if (existingAccount) {
        return existingAccount;
      }
      return null;
    } catch {
      return 'Account not found';
    }
  }
}
