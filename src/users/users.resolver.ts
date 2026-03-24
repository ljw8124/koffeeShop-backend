import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';

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
      return this.userService.createAccount(createdAccountInput);

    } catch(error) {
      return {
        ok: false,
        error
      }
    }
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput :LoginInput) {
    try {
      return this.userService.login(loginInput);

    } catch(error) {
      console.error(error);
      return {
        ok: false,
        error
      };
    }
  }

  @Query(returns => User)
  me(@Context() context) {
    // console.log(context);
    if(!context.user) {
      return;
    } else {
      return context.user;
    }
  }

}