import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  // 1. 중복체크
  // 2. 유저 만들어주기, 계정생성, 비밀번호 암호화
  // 3. 결과값 반환
  async createAccount({ email, password, role }: CreateAccountInput) {
    try {
      const exists = await this.users.findOne({
        where: { email },
      });

      // 중복체크
      if(exists) {
        return;
      }

      await this.users.save(this.users.create({ email, password, role }));

      return true;

    } catch(e) {
      console.error(e);
      return;
    }

  }
}