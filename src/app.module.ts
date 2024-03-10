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

@Module({
  imports: [
    AuthModule,
    UserModule,
    AccountModule,
    FriendModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
