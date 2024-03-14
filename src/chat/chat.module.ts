import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ChatGateway,
    AuthService,
    MessageService,
    PrismaService,
    JwtService,
  ],
})
export class ChatModule {}
