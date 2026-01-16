import { Resolver, Query } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  @Query(() => Restaurant)
  myRestaurants() {
    return true;
  }
}
