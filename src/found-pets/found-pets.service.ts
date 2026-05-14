import { Injectable } from '@nestjs/common';
import { FoundPetCDto } from 'src/core/interfaces/found-pet.interfaces';
import { EmailOptions } from 'src/core/interfaces/mail-options.interfaces';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from './templates/found-pets-email.template';
import { FoundPet } from 'src/core/db/entities/foundpets.entity';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { logger } from 'src/config/logger';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_FOUND_PETS = "found-pets:all";

@Injectable()
export class FoundPetsService {

    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ) {}

    async findAll() {
        logger.info(`[FoundPetsService] Consultando mascotas encontradas en caché...`);
        const cachedData = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);

        if (cachedData) {
            logger.info(`[FoundPetsService] Mascotas encontradas en caché`);
            return cachedData;
        }

        logger.info(`[FoundPetsService] Obteniendo todas las mascotas encontradas de BD...`);
        const pets = await this.foundPetRepository.find();
        logger.info(`[FoundPetsService] Total de mascotas encontradas: ${pets.length}`);

        logger.info(`[FoundPetsService] Guardando en caché`);
        await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, pets, 60000);

        return pets;
    }

    async createFoundPet(foundPet : FoundPetCDto){
        logger.info(`[FoundPetsService] Creando mascota encontrada: ${foundPet.species} en (${foundPet.lat}, ${foundPet.lon})`);

        try {
            const newFoundPet = this.foundPetRepository.create({
                species: foundPet.species,
                breed: foundPet.breed,
                color: foundPet.color,
                size: foundPet.size,
                description: foundPet.description,
                photo_url: foundPet.photo_url,
                finder_name: foundPet.finder_name,
                finder_email: foundPet.finder_email,
                finder_phone: foundPet.finder_phone,
                address: foundPet.address,
                found_date: foundPet.found_date,
                location: {
                    type: 'Point',
                    coordinates: [foundPet.lon, foundPet.lat]
                }
            });

            logger.info(`[FoundPetsService] Guardando mascota encontrada en BD...`);
            const savedFoundPet = await this.foundPetRepository.save(newFoundPet);
            logger.info(`[FoundPetsService] Mascota guardada con ID: ${savedFoundPet.id}`);

            logger.info(`[FoundPetsService] Invalidando caché`);
            await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

            logger.info(`[FoundPetsService] Buscando mascotas perdidas en radio de 500m...`);
            const nearbyLostPets = await this.lostPetRepository.query(
                `
                    SELECT
                        lp.*,
                        ST_Distance(
                            lp.location::geography,
                            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                        ) AS distance
                    FROM lost_pets lp
                    WHERE lp.is_active = true
                        AND ST_DWithin(
                            lp.location::geography,
                            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                            $3
                        )
                    ORDER BY distance ASC
                `,
                [foundPet.lon, foundPet.lat, 500]
            );
            logger.info(`[FoundPetsService] ${nearbyLostPets.length} mascotas perdidas encontradas`);

            logger.info(`[FoundPetsService] Enviando email de notificación...`);
            const options : EmailOptions = {
                to: 'soyangeldavid1@gmail.com',
                subject: `Se encontró un ${foundPet.species}`,
                html: generateFoundPetEmailTemplate(foundPet)
            };
            const emailSent = await this.emailService.sendEmail(options);
            logger.info(`[FoundPetsService] Email enviado: ${emailSent}`);

            logger.info(`[FoundPetsService] Proceso completado exitosamente`);
            return {
                foundPet: savedFoundPet,
                emailSent,
                nearbyLostPets
            };
        } catch (error) {
            logger.info(`[FoundPetsService] Error creando mascota encontrada: ${error}`);
            throw error;
        }
    }

}
