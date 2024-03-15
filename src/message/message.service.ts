import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(roomId: string) {
    try {
      return await this.prisma.message.findMany({
        where: {
          roomId: roomId,
        },
      });
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      return await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          roomId: createMessageDto.roomId,
          senderId: createMessageDto.userId,
        },
      });
    } catch (error) {
      console.error('Error in createMessage:', error);
      throw error;
    }
  }
}
