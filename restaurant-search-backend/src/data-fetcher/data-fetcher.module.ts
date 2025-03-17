import { Module } from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import { DataTransformerModule } from '../data-transformer/data-transformer.module';

@Module({
  imports: [DataTransformerModule],
  providers: [DataFetcherService],
  exports: [DataFetcherService]
})
export class DataFetcherModule {}
