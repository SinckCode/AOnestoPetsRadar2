import { Injectable } from '@nestjs/common';
import { LostPetCDto } from 'src/core/interfaces/lost-pet.interfaces';
import { EmailOptions } from 'src/core/interfaces/mail-options.interfaces';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from 'src/found-pets/templates/found-pets-email.template';
import { generateLostPetEmailTemplate } from './templates/lost-pets-email.template';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { logger } from 'src/config/logger';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_LOST_PETS = "lost-pets:all";

@Injectable()
export class LostPetsService {

    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ) {}

    async findAll() {
        logger.info(`[LostPetsService] Consultando mascotas perdidas en caché...`);
        const cachedData = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);

        if (cachedData) {
            logger.info(`[LostPetsService] Mascotas perdidas encontradas en caché`);
            return cachedData;
        }

        logger.info(`[LostPetsService] Obteniendo mascotas perdidas activas de BD...`);
        const pets = await this.lostPetRepository.find({
            where: { is_active: true }
        });
        logger.info(`[LostPetsService] Se obtuvieron ${pets.length} mascotas perdidas`);

        logger.info(`[LostPetsService] Guardando en caché`);
        await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, pets, 60000);

        return pets;
    }

    async findByRadius(lat: number, lon: number, radiusInMeters: number = 500): Promise<any[]> {
        logger.info(`[LostPetsService] Buscando mascotas perdidas activas en radio de ${radiusInMeters}m desde (${lat}, ${lon})`);

        try {
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
                [lon, lat, radiusInMeters]
            );

            logger.info(`[LostPetsService] ${nearbyLostPets.length} mascotas perdidas encontradas en radio de ${radiusInMeters}m`);
            return nearbyLostPets;
        } catch (error) {
            logger.info(`[LostPetsService] Error en búsqueda por radio: ${error}`);
            throw error;
        }
    }

    async createLostPet(lostPet : LostPetCDto): Promise<Boolean>{
        logger.info(`[LostPetsService] Creando mascota perdida: ${lostPet.name} (${lostPet.species})`);

        try {
            const newLostPet = this.lostPetRepository.create({
                name: lostPet.name,
                species: lostPet.species,
                breed: lostPet.breed,
                color: lostPet.color,
                size: lostPet.size,
                description: lostPet.description,
                photo_url: lostPet.photo_url,
                owner_name: lostPet.owner_name,
                owner_email: lostPet.owner_email,
                owner_phone: lostPet.owner_phone,
                address: lostPet.address,
                lost_date: lostPet.lost_date,
                location: {
                    type: 'Point',
                    coordinates: [lostPet.lon, lostPet.lat]
                }
            });

            logger.info(`[LostPetsService] Guardando mascota perdida en BD...`);
            await this.lostPetRepository.save(newLostPet);
            logger.info(`[LostPetsService] Mascota guardada exitosamente`);

            logger.info(`[LostPetsService] Invalidando caché`);
            await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);

            logger.info(`[LostPetsService] Enviando email de notificación...`);
            const options : EmailOptions = {
                to: 'soyangeldavid1@gmail.com',
                subject: `Se perdió un ${lostPet.species} de nombre ${lostPet.name}`,
                html: generateLostPetEmailTemplate(lostPet)
            };
            const result = await this.emailService.sendEmail(options);
            logger.info(`[LostPetsService] Email enviado: ${result}`);
            return result;
        } catch (error) {
            logger.info(`[LostPetsService] Error al crear mascota perdida: ${error}`);
            throw error;
        }
    }

}
