import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataFetcherService } from '../data-fetcher/data-fetcher.service';
import { DataTransformerService } from '../data-transformer/data-transformer.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly BATCH_SIZE = 1000; // Process 1000 records at a time

  constructor(
    private readonly dataFetcherService: DataFetcherService,
    private readonly dataTransformerService: DataTransformerService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing SchedulerService...');
    await this.handleDataIngestion();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDataIngestion() {
    try {
      this.logger.log('Starting data ingestion process');

      // Fetch data from CSV file
      const rawData = await this.dataFetcherService.fetchData({
        type: 'csv',
        path: 'data/restaurants_400k.csv'
      });

      // Transform data
      const transformedData = this.dataTransformerService.transform(rawData);

      // Process in batches
      for (let i = 0; i < transformedData.length; i += this.BATCH_SIZE) {
        const batch = transformedData.slice(i, i + this.BATCH_SIZE);
        await this.elasticsearchService.bulkIndex(batch);
        this.logger.log(
          `Indexed batch ${i / this.BATCH_SIZE + 1} of ${Math.ceil(transformedData.length / this.BATCH_SIZE)}`
        );
      }

      this.logger.log('Data ingestion completed successfully');
    } catch (error) {
      this.logger.error(`Data ingestion failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
