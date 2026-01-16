import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RestaurantsResolver {
  @Query(() => Boolean)
  isGood() {
    return true;
  }
}