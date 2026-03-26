import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

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
  async login(@Args('input') loginInput :LoginInput): Promise<LoginOutput> {
    try {
      return await this.userService.login(loginInput);

    } catch(error) {
      console.error(error);
      return {
        ok: false,
        error
      };
    }
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOutput)
  async userProfile(@Args() userProfileInput : UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.userService.findById(userProfileInput.userId);

      return {
        ok: !!user,
        user,
      }
    } catch(e) {
      return {
        error: 'User Not Found',
        ok: false
      }
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => EditProfileOutput)
  async editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput) : Promise<EditProfileOutput> {
    try {
      const updateResult = await this.userService.editProfile(authUser.id, editProfileInput)

      return {
        ok : true
      }

    } catch(error) {
      return {
        ok: false,
        error
      }
    }
  }


}