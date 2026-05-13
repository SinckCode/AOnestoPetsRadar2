import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FoundPetsService } from './found-pets.service';
import type { FoundPetCDto } from 'src/core/interfaces/found-pet.interfaces';

@Controller('found-pets')
export class FoundPetsController {

    constructor(private readonly FoundPetsService: FoundPetsService){}

    @UseInterceptors(CacheInterceptor)
    @Get()
    async findAll() {
        return this.FoundPetsService.findAll();
    }

    @Post()
    async createFoundPet(@Body() foundPet : FoundPetCDto) {
        const result = await this.FoundPetsService.createFoundPet(foundPet);
                return {
                    message: 'Se creo una mascota encontrada',
                    ...result
                };
    }

}
