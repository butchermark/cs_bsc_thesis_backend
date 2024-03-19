import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NewsService {
  async getNewsForApp(appId: number) {
    try {
      const response = await axios.get(process.env.STEAM_API_NEWS_URL, {
        params: {
          appid: appId,
          count: 10,
          maxlength: 200,
          format: 'json',
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors appropriately
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}
