import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Res() res: Response): Promise<Object> {
    const jwt = await this.authService.signin(dto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accesstoken);
    return res.json(jwt);
  }

  @HttpCode(HttpStatus.OK)
  @Get('validate')
  async validate(@Req() req: Request): Promise<Object> {
    const user = await this.authService.validateUser(req.headers.authorization);
    return { message: 'token is valid', user: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-and-generate-new-refresh-token')
  async validateRefreshToken(@Body() refreshTokenDto: string): Promise<any> {
    return this.authService.validateRefreshToken(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user-refresh-token')
  async getUserRefreshToken(
    @Query('userId') userId: string,
  ): Promise<RefreshTokenDto> {
    const refreshToken = await this.authService.getUserRefreshToken(userId);
    return { refreshToken };
  }
}
