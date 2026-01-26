import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurant.resolver';

@Module({
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {}
