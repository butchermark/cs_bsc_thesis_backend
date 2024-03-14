import { Injectable } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private messageService: MessageService,
  ) {}

  async createRoom(payload: any) {
    try {
      const users = payload.users.map((userId: string) => ({
        id: userId,
      }));

      const room = await this.prisma.room.create({
        data: {
          users: {
            connect: users,
          },
        },
      });

      console.log('Room created:', room);
      return room;
    } catch (error) {
      console.error('Error in createRoom:', error);
      throw error;
    }
  }

  async getRoom(userId1: string, userId2: string) {
    try {
      const room = await this.prisma.room.findFirst({
        where: {
          AND: [
            { users: { some: { id: userId1 } } },
            { users: { some: { id: userId2 } } },
          ],
        },
      });

      if (!room) {
        return null;
      }
      const messages = await this.messageService.getMessages(room.id);

      return {
        ...room,
        messages: messages,
      };
    } catch (error) {
      console.error('Error in getRoom:', error);
      throw error;
    }
  }
}
