import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { exist } from 'joi';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  // 1. 중복체크
  // 2. 유저 만들어주기, 계정생성, 비밀번호 암호화
  // 3. 결과값 반환
  async createAccount({ email, password, role }: CreateAccountInput): Promise<{ok: boolean, error?: string}> {
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
}