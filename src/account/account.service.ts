import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getUserAccountTypes(id: string) {
    const accountTypes = await this.prisma.account.findMany({
      where: {
        userId: id,
      },
    });
    return accountTypes;
  }
}
