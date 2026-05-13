import { Injectable } from '@nestjs/common';
import { LostPetCDto } from 'src/core/interfaces/lost-pet.interfaces';
import { EmailOptions } from 'src/core/interfaces/mail-options.interfaces';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from 'src/found-pets/templates/found-pets-email.template';
import { generateLostPetEmailTemplate } from './templates/lost-pets-email.template';
import { LostPet } from 'src/core/db/entities/lostpets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LostPetsService {

    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService
    ) {}

    async findAll() {
        return this.lostPetRepository.find({
            where: { is_active: true }
        });
    }

    async createLostPet(lostPet : LostPetCDto): Promise<Boolean>{

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

        await this.lostPetRepository.save(newLostPet);

        const options : EmailOptions = {
            to: 'soyangeldavid1@gmail.com',
            subject: `Se perdió un ${lostPet.species} de nombre ${lostPet.name}`,
            html: generateLostPetEmailTemplate(lostPet)
        };
        const result = await this.emailService.sendEmail(options);
        return result;
    }

}
