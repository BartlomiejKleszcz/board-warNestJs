import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const prismaMock = {
    user: { findUnique: jest.fn() },
    player: { create: jest.fn() },
    // mimic Prisma $transaction signature used in service
    $transaction: jest.fn(async (cb: (tx: unknown) => unknown) =>
      cb({ user: { create: jest.fn() }, player: { create: jest.fn() } }),
    ),
  } as unknown as PrismaService; // loosen typing: Prisma delegate types have more methods

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
