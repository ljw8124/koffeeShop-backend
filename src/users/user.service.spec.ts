import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type mockRepository<T = any> = Partial<Record<keyof Repository<User>, jest.Mock>>;

describe("User Service", () => {

  let service: UsersService;
  let usersRepository: mockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService, {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        }, {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        }, {
          provide: JwtService,
          useValue: mockJwtService,
        }, {
          provide: MailService,
          useValue: mockMailService,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: "newUser@naver.com",
      password: "",
      role: 0,
    };

    it("should fail if user exists", async () => {
      usersRepository.findOne?.mockResolvedValue({
        id: 1,
        email: 'testMock@gmail.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is user with that email already exists',
      });
    });

    it('should create a new user', async () => {
      usersRepository.findOne?.mockResolvedValue(undefined);
      usersRepository.create?.mockReturnValue(createAccountArgs)
      await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
    })
  });

  it.todo('login');
  it.todo('findbyId');
  it.todo('editProfile');
  it.todo('verifyEmail');
});