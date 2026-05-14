import { Body, Controller, Get, Post, UseInterceptors, Param } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LostPetsService } from './lost-pets.service';
import type { LostPetCDto } from 'src/core/interfaces/lost-pet.interfaces';

@Controller('lost-pets')
export class LostPetsController {

    constructor(private readonly LostPetsService: LostPetsService){}

    @UseInterceptors(CacheInterceptor)
    @Get()
    async findAll() {
        return this.LostPetsService.findAll();
    }

    @Get(':lat/:lon/radius')
    async findByRadius(@Param('lat') lat: number, @Param('lon') lon: number) {
        return this.LostPetsService.findByRadius(parseFloat(lat.toString()), parseFloat(lon.toString()), 500);
    }

    @Post()
    async createLostPet(@Body() lostPet: LostPetCDto) {
        const result = await this.LostPetsService.createLostPet(lostPet);
        return "se creo una Mascota perdida" + result;
    }

}
