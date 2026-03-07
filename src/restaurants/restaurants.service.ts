import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Injectable()
export class RestaurantsService {

  constructor(@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  createRestaurant(createRestaurantDto: CreateRestaurantDto) : Promise<Restaurant> {
    /**
     * 고전적인 방법
    const newRestaurant = new Restaurant();
    newRestaurant.name = createRestaurantDto.name;
    */
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    return this.restaurants.save(newRestaurant);
  }

}