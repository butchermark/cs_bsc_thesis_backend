import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, MessageService],
})
export class RoomModule {}
