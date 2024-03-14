import { IsInt } from 'class-validator';

export class GetMessagesDto {
  @IsInt()
  readonly roomId: String;
}
