import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(returns => Boolean)
  temp() {
    return true;
  }

  @Mutation(returns => CreateAccountOutput)
  async createAccount(@Args("input") createdAccountInput: CreateAccountInput) : Promise<CreateAccountOutput> {
    try {
      const { ok, error } = await this.userService.createAccount(createdAccountInput);

      return { ok, error };

    } catch(error) {
      return {
        ok: false,
        error
      }
    }
  }
}