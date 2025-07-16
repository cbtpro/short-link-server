import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DataSource,
          useValue: {
            // 你可以根据需要添加 DataSource 的方法模拟
            manager: {
              findOne: jest.fn(),
              save: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
            // 模拟其他 JwtService 方法
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a signed token', () => {
    const token = authService.validateUser('test', 'test');
    expect(token).toBe('signed-token');
    expect(jwtService.sign).toHaveBeenCalledWith({ data: 'test' });
  });
});
