import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getNewsForApp(@Query('appId') appId: number) {
    if (!appId || isNaN(appId)) {
      throw new BadRequestException(
        'Invalid query parameters. All parameters must be provided and must be numbers.',
      );
    }

    try {
      return await this.newsService.getNewsForApp(appId);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}
