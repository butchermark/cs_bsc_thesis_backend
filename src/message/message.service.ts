import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { HttpStatusCode } from 'axios';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(getMessagesDto: GetMessagesDto) {
    try {
      return await this.prisma.message.findMany({
        where: {
          roomId: getMessagesDto.roomId,
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
        },
      });
    } catch (error) {
      console.error('Error in createMessage:', error);
      throw error;
    }
  }
}
