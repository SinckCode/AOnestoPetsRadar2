import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { envs } from './config/envs';
import { dataSourceOptions } from './core/db/data.source';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          url: envs.REDIS_URL,
        });
        return {
          store,
          ttl: 60000,
        };
      },
    }),
    EmailModule,
    FoundPetsModule,
    LostPetsModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
