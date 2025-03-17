import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { DataFetcherModule } from '../data-fetcher/data-fetcher.module';
import { DataTransformerModule } from '../data-transformer/data-transformer.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [DataFetcherModule, DataTransformerModule, ElasticsearchModule],
  providers: [SchedulerService],
  exports: [SchedulerService]
})
export class SchedulerModule {}
