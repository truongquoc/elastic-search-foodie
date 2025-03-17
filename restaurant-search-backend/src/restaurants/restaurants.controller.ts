import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantData } from 'src/interfaces/restaurant-data.interface';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  @Get('search')
  async searchRestaurants(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius = '5km',
    @Query('cuisine') cuisine: string,
    @Query('priceRange') priceRange: string,
    @Query('minRating') minRating: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ) {
    const filters = {
      cuisine,
      priceRange,
      minRating
    };
    const from = (page - 1) * size;
    const results = await this.elasticsearchService.searchNearestRestaurants(
      lat,
      lon,
      radius,
      filters
    );
    return {
      total: results.hits.total,
      page,
      size,
      data: results.hits.hits.map((hit) => hit._source)
    };
  }
}
