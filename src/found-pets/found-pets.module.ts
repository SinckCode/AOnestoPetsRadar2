import { Module } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/foundpets.entity';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { CacheModuleService } from 'src/cache/cache.module';

@Module({
  imports: [
    EmailModule,
    CacheModuleService,
    TypeOrmModule.forFeature([FoundPet, LostPet])
   ],
  providers: [FoundPetsService],
  controllers: [FoundPetsController]
})
export class FoundPetsModule {}
