import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import * as jwt from 'jsonwebtoken';
import { LoginInput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  // 1. 중복체크
  // 2. 유저 만들어주기, 계정생성, 비밀번호 암호화
  // 3. 결과값 반환
  async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      // 중복체크
      if(!exists) await this.users.save(this.users.create({ email, password, role }));

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
      const user = await this.users.findOne({ where: { email } });

      if(!!user) {
        const passwordedCorrect = await user.checkPassword(password);

        if(!passwordedCorrect) return { ok: false, error: 'Wrong password' };
      }

      return {
        ok: !!user,
        error: user ? undefined : 'User not Found',
        token: user ? this.jwtService.sign(user.id) : undefined,
      };
    } catch(error) {
      console.error(error);
      return {
        ok: false,
        error
      }
    }
  }

}