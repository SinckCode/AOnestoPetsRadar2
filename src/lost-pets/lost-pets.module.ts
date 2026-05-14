import { Module } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { CacheModuleService } from 'src/cache/cache.module';

@Module({
  imports: [
    EmailModule,
    CacheModuleService,
    TypeOrmModule.forFeature([LostPet])
 ],
  providers: [LostPetsService],
  controllers: [LostPetsController]
})
export class LostPetsModule {}
