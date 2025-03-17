import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { DataFetcherModule } from './data-fetcher/data-fetcher.module';
import { DataTransformerModule } from './data-transformer/data-transformer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RestaurantsModule,
    ElasticsearchModule,
    SchedulerModule,
    DataFetcherModule,
    DataTransformerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
