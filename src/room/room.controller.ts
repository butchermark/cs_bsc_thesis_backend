import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body() payload: any) {
    return this.roomService.createRoom(payload);
  }

  @Get('/:userId1/:userId2')
  getRoom(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.roomService.getRoom(userId1, userId2);
  }
}
