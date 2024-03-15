import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUserAccountTypes(@Param('id') id: string) {
    return this.accountService.getUserAccountTypes(id);
  }
}
