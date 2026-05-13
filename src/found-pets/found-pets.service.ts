import { Injectable } from '@nestjs/common';
import { FoundPetCDto } from 'src/core/interfaces/found-pet.interfaces';
import { EmailOptions } from 'src/core/interfaces/mail-options.interfaces';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from './templates/found-pets-email.template';
import { FoundPet } from 'src/core/db/entities/foundpets.entity';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoundPetsService {

    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService
    ) {}

    async findAll() {
        return this.foundPetRepository.find();
    }

    async createFoundPet(foundPet : FoundPetCDto){

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

                const savedFoundPet = await this.foundPetRepository.save(newFoundPet);

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

        const options : EmailOptions = {
            to: 'soyangeldavid1@gmail.com',
            subject: `Se encontró un ${foundPet.species}`,
            html: generateFoundPetEmailTemplate(foundPet)
        };
                const emailSent = await this.emailService.sendEmail(options);

                return {
                    foundPet: savedFoundPet,
                    emailSent,
                    nearbyLostPets
                };
    }

}
