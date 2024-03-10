import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signin(dto: AuthDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists', dto.email);
    }

    const hashedPassword = await crypto
      .createHmac('sha256', process.env.USER_SALT)
      .update(dto.password)
      .digest('base64');
    dto.password = hashedPassword;

    if (dto.password !== user.password || user.email !== dto.email)
      throw new UnauthorizedException('Password or email does not match');

    const tokens = await this.generateTokens(user);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });

    return {
      tokens,
      user,
    };
  }

  async validateUser(authHeader: any): Promise<User> {
    try {
      const verifiedToken = await this.jwtService.verify(
        authHeader.split(' ')[1],
        { secret: process.env.JWT_SECRET },
      );

      const userId = verifiedToken.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return verifiedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateRefreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      const user = await this.prisma.user.findUnique({
        where: {
          id: sub,
        },
      });

      const tokens = await this.generateTokens(user);

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: tokens.refreshToken,
        },
      });

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Something went wrong');
    }
  }

  async getUserRefreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user.refreshToken;
  }

  private async generateTokens(user: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        user.id.toString(),
        parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '60', 10),
        {
          is_admin: user.is_admin,
        },
      ),
      this.signToken(
        user.id.toString(),
        parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '60', 10),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken(userId: string, expiresIn: number, payload?: any) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn,
      },
    );
  }
}
