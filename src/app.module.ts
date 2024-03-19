import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { FriendModule } from './friend/friend.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { ChatModule } from './chat/chat.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AccountModule,
    FriendModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    MessageModule,
    RoomModule,
    ChatModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
