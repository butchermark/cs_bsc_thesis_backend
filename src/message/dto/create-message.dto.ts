import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  readonly roomId: string;

  readonly userId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  readonly content: string;
}
