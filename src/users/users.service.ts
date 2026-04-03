import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { Mutation } from '@nestjs/graphql';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService
  ) { }

  // 1. 중복체크
  // 2. 유저 만들어주기, 계정생성, 비밀번호 암호화
  // 3. 결과값 반환
  async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      // 중복체크
      if(!exists) {
        const user = await this.users.save(this.users.create({ email, password, role }));
        await this.verification.save(this.verification.create({ user }));
      }

      return {
        ok: !exists,
        error: exists ? "There is user with that email already exists" : undefined
      };

    } catch(e) {
      console.error(e);
      return {
        ok: false,
        error: e
      };
    }

  }

  // 1. 이메일로 유저찾기
  // 2. 비밀번호 비교
  // 3. JMT 발행
  async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
    try {
      const user = await this.users.findOne({ where: { email }, select: ['id', 'password'] });

      if(!user) throw new Error('User not found');
      if(!await user.checkPassword(password)) throw new Error('Wrong password');

      return {
        ok: true,
        token: this.jwtService.sign(user.id),
      };

    } catch(error) {
      console.error(error);
      return {
        ok: false,
        error
      }
    }
  }
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      return { ok: true };

    }catch(error) {
      return {
        ok: false,
        error
      }
    }
  }

  async editProfile(userId: number, { email, password } : EditProfileInput): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });

      if (!user) throw new Error('User not found');

      if (email) {
        user.email = email;
        user.verified = false;
        await this.verification.save(this.verification.create({ user }));
      }
      if (password) {
        user.password = password;
      }
      // update 함수를 사용하면 query 만을 만들어내기 때문에 users.entity 에 BeforeUpdate hook 이 작동하지 않게됨
      await this.users.save(user);
      return { ok: true };

    } catch(error) {
      console.error(error);
      return {
        ok: false,
        error
      }
    }
  }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
      try {
        const verification = await this.verification.findOne({
          where: { code },
          relations: ['user'],
        });

        if (verification) {
          verification.user.verified = true;
          await this.users.save(verification.user);
        }
        return {
          ok: !!verification,
          error: !verification ? 'Verification not found': undefined
        };

      } catch(error) {
        console.error(error);
        return { ok: false, error };
      }
    }

}