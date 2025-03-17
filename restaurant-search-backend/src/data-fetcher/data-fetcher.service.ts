import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { DataTransformerService } from '../data-transformer/data-transformer.service';

export interface RawRestaurantData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  cuisine: string;
}
interface CsvRowData {
  [key: string]: string;
}

@Injectable()
export class DataFetcherService implements OnModuleInit {
  private readonly logger = new Logger(DataFetcherService.name);
  private cachedData: any[] = [];

  constructor(
    private readonly dataTransformerService: DataTransformerService
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing DataFetcherService...');
      const rawData = await this.fetchData({
        type: 'csv',
        // Update the path to match your project structure
        path: 'data/restaurants_400k.csv'
      });
      this.cachedData = this.dataTransformerService.transform(rawData);
      this.logger.log(
        `Successfully loaded ${this.cachedData.length} records during initialization`
      );
    } catch (error) {
      this.logger.error(
        `Failed to initialize data: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async fetchData(source: {
    type: string;
    path?: string;
    url?: string;
  }): Promise<RawRestaurantData[]> {
    try {
      this.logger.log(`Fetching data from ${source.type} source`);

      switch (source.type) {
        case 'csv':
          if (!source.path) {
            throw new Error('CSV path is required');
          }
          return await this.fetchFromCsv(source.path);
        default:
          throw new Error(`Unsupported data source type: ${source.type}`);
      }
    } catch (error) {
      this.logger.error(`Error fetching data: ${(error as Error).message}`);
      throw error;
    }
  }

  private async fetchFromCsv(path: string): Promise<RawRestaurantData[]> {
    this.logger.debug(`Attempting to read CSV from: ${process.cwd()}`);
    this.logger.debug(`Full path: ${path}`);
  
    if (!fs.existsSync(path)) {
      throw new Error(`CSV file not found at path: ${path}`);
    }
  
    return new Promise((resolve, reject) => {
      const results: RawRestaurantData[] = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on('data', (row: CsvRowData) => {
          try {
            const parsedData: RawRestaurantData = {
              id: row.id || '',
              name: row.name || '',
              address: row.address || '',
              city: row.city || '',
              state: row.state || '',
              postalCode: row.postal_code || row.postalCode || '',
              latitude: row.latitude || '',
              longitude: row.longitude || '',
              minPrice: parseFloat(row.min_price || row.minPrice || '0'),
              maxPrice: parseFloat(row.max_price || row.maxPrice || '0'),
              rating: parseFloat(row.rating || '0'),
              cuisine: row.cuisine || ''
            };
            results.push(parsedData);
          } catch (error) {
            this.logger.warn(`Failed to parse row: ${JSON.stringify(row)}`);
          }
        })
        .on('end', () => {
          this.logger.log(`Successfully read ${results.length} records from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          this.logger.error(`Error reading CSV: ${error.message}`);
          reject(error);
        });
    });
  }
}