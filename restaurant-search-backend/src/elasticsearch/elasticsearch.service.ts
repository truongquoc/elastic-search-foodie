import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { RestaurantData } from 'src/interfaces/restaurant-data.interface';

interface SearchFilters {
  cuisine?: string;
  priceRange?: string;
  minRating?: number;
}

@Injectable()
export class ElasticsearchService {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly client: Client;

  constructor() {
    this.client = new Client({ node: 'http://localhost:9200' });
  }

  async indexRestaurant(restaurant: RestaurantData) {
    try {
      return await this.client.index({
        index: 'restaurants',
        body: restaurant
      });
    } catch (error) {
      this.logger.error(`Failed to index restaurant: ${error}`);
      throw error;
    }
  }

  async searchNearestRestaurants(
    lat: number,
    lon: number,
    radius: string,
    filters: SearchFilters
  ) {
    try {
      const query = {
        bool: {
          must: [] as any[],
          filter: [
            {
              geo_distance: {
                distance: radius,
                location: {
                  lat,
                  lon
                }
              }
            }
          ]
        }
      };

      if (filters.cuisine) {
        query.bool.must.push({ match: { cuisine: filters.cuisine } });
      }

      if (filters.priceRange) {
        query.bool.must.push({ match: { priceRange: filters.priceRange } });
      }

      if (filters.minRating) {
        query.bool.must.push({ range: { rating: { gte: filters.minRating } } });
      }

      return await this.client.search({
        index: 'restaurants',
        body: {
          query
        }
      });
    } catch (error) {
      this.logger.error(`Failed to search restaurants: ${error}`);
      throw error;
    }
  }

  async bulkIndex(restaurants: RestaurantData[]) {
    try {
      const body = restaurants.flatMap((doc) => [
        { index: { _index: 'restaurants' } },
        doc
      ]);
      return await this.client.bulk({ refresh: true, body });
    } catch (error) {
      this.logger.error(`Failed to bulk index restaurants: ${error}`);
      throw error;
    }
  }
}
