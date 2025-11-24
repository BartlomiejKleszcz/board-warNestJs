import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createPgAdapterFactory } from './pg-adapter';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      __internal: {
        engine: {
          type: 'binary',
        },
      },
      adapter: createPgAdapterFactory(process.env.DATABASE_URL) as any,
    } as any);
  }

  onModuleInit() {
    this.$connect();
  }
}
