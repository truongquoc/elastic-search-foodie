import { Injectable } from '@nestjs/common';
import { RestaurantData } from '../interfaces/restaurant-data.interface';
import { RawRestaurantData } from 'src/data-fetcher/data-fetcher.service';

@Injectable()
export class DataTransformerService {
  // Transform raw data to RestaurantData
  transform(rawData: RawRestaurantData[]): RestaurantData[] {
    return rawData.map((data) => {
      return {
        name: data.name,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        cuisine: data.cuisine,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        rating: data.rating,
        city: data.city
      };
    });
  }
}
